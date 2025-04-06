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

    try {
      const emailCheck = await this.prisma.emailCheck.findUnique({
        where: { id: emailCheckId },
        include: {
          bulkEmailCheck: true,
        },
      });

      if (!emailCheck) {
        console.log(`[EMAIL_CHECK] email check not found`);
        return;
      }

      if (emailCheck.status === 'completed') {
        console.log(
          `[EMAIL_CHECK] email check ${emailCheckId} already completed`,
        );
        return;
      }

      if (emailCheck.status === 'failed') {
        console.log(`[EMAIL_CHECK] retrying email check ${emailCheckId}`);
      }

      let globalError: any = null;

      console.log(
        `[EMAIL_CHECK] processing job ${job.id} | At ${moment().format(
          'DD/MM/YYYY HH:mm:ss',
        )}`,
      );

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

      let timeToWait = 0;

      if (emailChecksSentThisSecond >= settings.globalEmailsCheckPerSecond) {
        const lastEmailCheck = await this.prisma.emailCheck.findFirst({
          orderBy: {
            externalRequestAt: 'desc',
          },
          where: {
            externalRequestAt: {
              not: null,
            },
            status: {
              notIn: ['failed', 'pending'],
            },
          },
          select: {
            externalRequestAt: true,
          },
        });

        timeToWait = 1000;

        if (lastEmailCheck) {
          const lastExternalRequestAt = moment(
            lastEmailCheck.externalRequestAt,
          );
          const now = moment();

          const elapsedMilliseconds = now.diff(
            lastExternalRequestAt,
            'milliseconds',
          );
          const oneSecondInMilliseconds = 1000;

          timeToWait = Math.max(
            oneSecondInMilliseconds - elapsedMilliseconds,
            0,
          );
        }
      }

      if (timeToWait > 0) {
        console.log(
          `[EMAIL_CHECK] rate second limit exceeded, waiting ${timeToWait} milliseconds. Will reset at ${moment(Date.now() + timeToWait).format('DD/MM/YYYY HH:mm:ss')}`,
        );

        await this.queue.rateLimit(timeToWait);
        throw Worker.RateLimitError();
      }

      try {
        await this.prisma.emailCheck.update({
          where: { id: emailCheckId },
          data: { status: 'processing', startedAt: new Date() },
        });

        let { data: response } = await this.truelistClient.post(
          `/v1/verify_inline`,
          {
            email: emailCheck.email,
          },
        );

        const externalRequestAt = new Date();

        console.log(
          `[EMAIL_CHECK] external request at: ${moment(
            externalRequestAt,
          ).format('DD/MM/YYYY HH:mm:ss:SSS')}`,
        );

        await this.prisma.emailCheck.update({
          where: { id: emailCheckId },
          data: { externalRequestAt },
        });

        response = response?.emails?.[0];

        if (!response) {
          throw new Error('No response found');
        }

        console.log(`[EMAIL_CHECK] response: ${JSON.stringify(response)}`);

        let result = null;

        const markedBounceTo = await this.markBounceToService.get(
          emailCheck.email,
        );

        if (markedBounceTo) {
          console.log(
            `[EMAIL_CHECK] email ${emailCheck.email} is marked as bounce to ${markedBounceTo.bounceBy} at ${moment(markedBounceTo.createdAt).format('DD/MM/YYYY HH:mm:ss')}`,
          );
          result = 'email_invalid';
        } else {
          const finalResult: Record<EmailCheckResult, EmailCheckResult> = {
            ok: 'ok',
            email_invalid: 'email_invalid',
            risky: 'risky',
            unknown: 'unknown',
            accept_all: 'accept_all',
          };

          result = finalResult[response.email_state];
        }

        if (!result) {
          result = 'unknown';
        }

        await this.prisma.emailCheck.update({
          where: { id: emailCheckId },
          data: {
            status: 'completed',
            result,
          },
        });

        if (emailCheck.contactId && result !== 'ok') {
          await this.prisma.contact.update({
            where: { id: emailCheck.contactId },
            data: { bouncedAt: new Date(), bouncedBy: 'email_check' },
          });

          await this.markBounceToService.create(
            emailCheck.email,
            'email_check',
          );
        }

        console.log(`[EMAIL_CHECK] job ${job.id} completed: ${result}`);
      } catch (error) {
        console.error(`[EMAIL_CHECK] error processing job ${job.id}`);

        await this.prisma.emailCheck.update({
          where: { id: emailCheckId },
          data: { status: 'failed', result: 'unknown' },
        });

        globalError = error?.response?.data || error;
        console.error(globalError);
      } finally {
        const finishedAt = new Date();

        if (emailCheck.bulkEmailCheckId) {
          const pendingChecks = await this.prisma.emailCheck.count({
            where: {
              bulkEmailCheckId: emailCheck.bulkEmailCheckId,
              status: { in: ['pending', 'processing'] },
            },
          });

          if (pendingChecks === 0) {
            await this.prisma.bulkEmailCheck.update({
              where: { id: emailCheck.bulkEmailCheckId },
              data: { status: globalError ? 'failed' : 'completed' },
            });

            await this.queueChargeBulkEmailCheckService.add(
              emailCheck.bulkEmailCheck.userId,
              emailCheck.bulkEmailCheckId,
            );
          }
        }

        await this.prisma.emailCheck.update({
          where: { id: emailCheckId },
          data: { processedAt: finishedAt },
        });
      }
    } catch (error) {
      throw error;
    } finally {
      const finishedAt = new Date();
      const duration = moment(finishedAt).diff(
        processStartedAt,
        'milliseconds',
      );

      console.log(
        `[EMAIL_CHECK] job ${job.id} completed in ${duration} milliseconds | Finished at ${moment(finishedAt).format('DD/MM/YYYY HH:mm:ss:SSS')}`,
      );
    }
  }
}
