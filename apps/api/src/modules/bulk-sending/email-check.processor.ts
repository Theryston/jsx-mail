import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from 'src/services/prisma.service';
import moment from 'moment';
import { GetSettingsService } from '../user/services/get-settings.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import axios, { AxiosInstance } from 'axios';
import { EmailCheckResult } from '@prisma/client';
import { QueueChargeBulkEmailCheckService } from '../worker/services/queue-charge-bulk-email-check.service';
import { Worker } from 'bullmq';
import { MarkBounceToService } from '../email/services/mark-bounce-to.service';
import { EMAIL_CHECK_ATTEMPTS } from 'src/utils/constants';

@Processor('email-check', { concurrency: 1 })
export class EmailCheckProcessor extends WorkerHost {
  truelistClient: AxiosInstance;

  constructor(
    private readonly prisma: PrismaService,
    private readonly getSettingsService: GetSettingsService,
    @InjectQueue('email-check') private readonly queue: Queue,
    private readonly queueChargeBulkEmailCheckService: QueueChargeBulkEmailCheckService,
    private readonly markBounceToService: MarkBounceToService,
  ) {
    super();
    this.truelistClient = axios.create({
      baseURL: 'https://api.truelist.io/api',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.TRUELIST_API_KEY}`,
      },
    });
  }

  async process(job: Job) {
    const { emailCheckId } = job.data;

    if (!emailCheckId) {
      console.log(`[EMAIL_CHECK] email check id is required`);
      return;
    }

    let processStartedAt = new Date();

    const emailCheck = await this.getEmailCheck(emailCheckId);
    if (!emailCheck) return;

    if (emailCheck.status === 'completed') {
      console.log(
        `[EMAIL_CHECK] email check ${emailCheckId} already completed`,
      );
      return;
    }

    console.log(
      `[EMAIL_CHECK] processing job ${job.id} | At ${moment().format(
        'DD/MM/YYYY HH:mm:ss',
      )}`,
    );

    await this.handleRateLimiting();

    let processedError: any = null;

    try {
      await this.updateProcessingEmailCheckStatus(emailCheckId);
      const result = await this.processEmailCheck(emailCheck);
      await this.updateEmailCheckResult(emailCheckId, result);
      await this.handleBounce(emailCheck, result);
      console.log(`[EMAIL_CHECK] job ${job.id} completed: ${result}`);
    } catch (error) {
      processedError = await this.handleError(job, emailCheckId, error);
    } finally {
      await this.finalizeProcess(job, emailCheck, processStartedAt);
    }

    if (processedError) {
      console.log(
        `[EMAIL_CHECK] processed error for job ${job.id}: `,
        processedError,
      );

      throw processedError;
    }
  }

  private async getEmailCheck(emailCheckId: string) {
    return await this.prisma.emailCheck.findUnique({
      where: { id: emailCheckId },
      include: {
        bulkEmailCheck: true,
      },
    });
  }

  private async handleRateLimiting() {
    const settings = await this.getSettingsService.execute();
    const lastSecond = moment().subtract(1, 'second').toDate();
    const emailChecksSentThisSecond = await this.prisma.emailCheck.count({
      where: {
        OR: [
          {
            processedAt: {
              gte: lastSecond,
            },
          },
          {
            startedAt: {
              gte: lastSecond,
            },
          },
          {
            externalRequestAt: {
              gte: lastSecond,
            },
          },
        ],
      },
    });

    console.log(
      `[EMAIL_CHECK] email checks sent this second: ${emailChecksSentThisSecond} | Rate limit: ${settings.globalEmailsCheckPerSecond}`,
    );

    if (emailChecksSentThisSecond >= settings.globalEmailsCheckPerSecond) {
      const timeToWait = await this.calculateWaitTime();

      if (timeToWait > 0) {
        await this.queue.rateLimit(timeToWait);
        throw Worker.RateLimitError();
      }
    }
  }

  private async calculateWaitTime() {
    const lastEmailCheck = await this.prisma.emailCheck.findFirst({
      orderBy: {
        externalRequestAt: 'desc',
      },
      select: {
        externalRequestAt: true,
      },
    });

    let timeToWait = 1000;

    if (lastEmailCheck) {
      const lastExternalRequestAt = moment(
        lastEmailCheck.externalRequestAt || new Date(),
      );
      const now = moment();

      const elapsedMilliseconds = now.diff(
        lastExternalRequestAt,
        'milliseconds',
      );
      const oneSecondInMilliseconds = 1000;

      timeToWait = Math.max(oneSecondInMilliseconds - elapsedMilliseconds, 0);
    }

    console.log(`[EMAIL_CHECK] time to wait: ${timeToWait}`);
    return timeToWait;
  }

  private async updateProcessingEmailCheckStatus(emailCheckId: string) {
    await this.prisma.emailCheck.update({
      where: { id: emailCheckId },
      data: { status: 'processing', startedAt: new Date(), willRetry: false },
    });
  }

  private async processEmailCheck(emailCheck: any) {
    const markedBounceTo = await this.markBounceToService.get(emailCheck.email);

    if (markedBounceTo) {
      console.log(
        `[EMAIL_CHECK] email ${emailCheck.email} is marked as bounce to ${markedBounceTo.bounceBy} at ${moment(markedBounceTo.createdAt).format('DD/MM/YYYY HH:mm:ss')}`,
      );
      return 'email_invalid' as EmailCheckResult;
    }

    const result = await this.getExternalResult(
      emailCheck.email,
      emailCheck.id,
    );

    return (result || 'unknown') as EmailCheckResult;
  }

  private async updateEmailCheckResult(
    emailCheckId: string,
    result: EmailCheckResult,
  ) {
    await this.prisma.emailCheck.update({
      where: { id: emailCheckId },
      data: {
        status: 'completed',
        result,
      },
    });
  }

  private async handleBounce(emailCheck: any, result: string) {
    if (emailCheck.contactId && result !== 'ok') {
      await this.prisma.contact.update({
        where: { id: emailCheck.contactId },
        data: { bouncedAt: new Date(), bouncedBy: 'email_check' },
      });

      await this.markBounceToService.create(emailCheck.email, 'email_check');
    }
  }

  private async handleError(job: Job, emailCheckId: string, error: any) {
    console.error(`[EMAIL_CHECK] error processing job ${job.id}`);

    const attemptsMade = (job.attemptsMade || 0) + 1;

    if (attemptsMade >= EMAIL_CHECK_ATTEMPTS) {
      await this.prisma.emailCheck.update({
        where: { id: emailCheckId },
        data: { status: 'failed', result: 'unknown', willRetry: false },
      });
    } else {
      console.log(
        `[EMAIL_CHECK] marking email check ${emailCheckId} as pending for retry | Attempt ${attemptsMade} of ${EMAIL_CHECK_ATTEMPTS}`,
      );

      await this.prisma.emailCheck.update({
        where: { id: emailCheckId },
        data: { status: 'pending', result: 'unknown', willRetry: true },
      });
    }

    const currentError = error?.response?.data || error;

    return currentError;
  }

  private async finalizeProcess(
    job: Job,
    emailCheck: any,
    processStartedAt: Date,
  ) {
    const finishedAt = new Date();

    const duration = moment(finishedAt).diff(processStartedAt, 'milliseconds');

    await this.prisma.emailCheck.update({
      where: { id: emailCheck.id },
      data: { processedAt: finishedAt },
    });

    console.log(
      `[EMAIL_CHECK] job ${job.id} completed in ${duration} milliseconds | Finished at ${moment(finishedAt).format('DD/MM/YYYY HH:mm:ss:SSS')}`,
    );

    if (!emailCheck.bulkEmailCheckId) return;

    const pendingChecks = await this.prisma.emailCheck.count({
      where: {
        bulkEmailCheckId: emailCheck.bulkEmailCheckId,
        status: { in: ['pending', 'processing'] },
      },
    });

    if (pendingChecks !== 0) return;

    await this.prisma.bulkEmailCheck.update({
      where: { id: emailCheck.bulkEmailCheckId },
      data: { status: 'completed' },
    });

    await this.queueChargeBulkEmailCheckService.add(
      emailCheck.bulkEmailCheck.userId,
      emailCheck.bulkEmailCheckId,
    );
  }

  async getExternalResult(email: string, emailCheckId: string) {
    const externalRequestAt = new Date();

    try {
      let { data: response } = await this.truelistClient.post(
        `/v1/verify_inline`,
        {
          email,
        },
      );

      response = response?.emails?.[0];

      if (!response) {
        throw new Error('No response found');
      }

      console.log(`[EMAIL_CHECK] response: ${JSON.stringify(response)}`);

      const finalResult: Record<EmailCheckResult, EmailCheckResult> = {
        ok: 'ok',
        email_invalid: 'email_invalid',
        risky: 'risky',
        unknown: 'unknown',
        accept_all: 'accept_all',
      };

      return finalResult[response.email_state];
    } finally {
      console.log(
        `[EMAIL_CHECK] external request updating to ${moment(
          externalRequestAt,
        ).format('DD/MM/YYYY HH:mm:ss:SSS')}`,
      );

      await this.prisma.emailCheck.update({
        where: { id: emailCheckId },
        data: { externalRequestAt },
      });
    }
  }
}
