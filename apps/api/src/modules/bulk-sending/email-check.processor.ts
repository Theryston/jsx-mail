import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from 'src/services/prisma.service';
import moment from 'moment';
import { GetSettingsService } from '../user/services/get-settings.service';
import { Worker } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import axios, { AxiosInstance } from 'axios';

@Processor('email-check', { concurrency: 1 })
export class EmailCheckProcessor extends WorkerHost {
  truelistClient: AxiosInstance;

  constructor(
    private readonly prisma: PrismaService,
    private readonly getSettingsService: GetSettingsService,
    @InjectQueue('email-check') private readonly queue: Queue,
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

    try {
      console.log(`[EMAIL_CHECK] processing job ${job.id}`);

      const settings = await this.getSettingsService.execute();

      const currentSecond = moment().startOf('second');
      const nextSecond = moment().add(1, 'second').startOf('second');
      const timeToWait = nextSecond.diff(moment(), 'milliseconds');

      const emailChecksSentThisSecond = await this.prisma.emailCheck.count({
        where: {
          status: {
            notIn: ['pending'],
          },
          createdAt: {
            gte: currentSecond.toDate(),
          },
        },
      });

      if (emailChecksSentThisSecond >= settings.globalEmailsCheckPerSecond) {
        console.log(
          `[EMAIL_CHECK] rate second limit exceeded, waiting ${timeToWait} milliseconds. Will reset at ${moment(Date.now() + timeToWait).format('DD/MM/YYYY HH:mm:ss')}`,
        );

        await this.queue.rateLimit(timeToWait);
        throw Worker.RateLimitError();
      }

      const emailCheck = await this.prisma.emailCheck.findUnique({
        where: { id: emailCheckId },
      });

      if (!emailCheck) {
        throw new Error('Email check not found');
      }

      let externalId = emailCheck.externalId;
      let email = emailCheck.email;

      if (!externalId) {
        const response = await this.truelistClient.post(`/v1/batches`, {
          data: [[email]],
        });

        externalId = response.data.id;

        await this.prisma.emailCheck.update({
          where: { id: emailCheckId },
          data: { externalId },
        });
      }

      while (true) {
        const response = await this.truelistClient.get(
          `/v1/batches/${externalId}`,
        );

        if (response.data.status === 'completed') {
          break;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      const { data: results } = await this.truelistClient.get(
        `/v1/email_addresses`,
        {
          params: {
            batch_uuid: externalId,
          },
        },
      );

      const result = results.email_addresses.find(
        (result) => result.address === email,
      );

      if (!result) {
        throw new Error('Email not found');
      }

      const resultMap = {
        ok: 'ok',
        risky: 'risky',
        invalid: 'invalid',
        unknown: 'unknown',
      } as const;

      const finalResult = resultMap[result.email_state];

      if (!finalResult) {
        throw new Error('Invalid email state');
      }

      await this.prisma.emailCheck.update({
        where: { id: emailCheckId },
        data: { status: 'completed', result: finalResult },
      });

      if (emailCheck.contactId && finalResult !== 'ok') {
        await this.prisma.contact.update({
          where: { id: emailCheck.contactId },
          data: { bouncedAt: new Date(), bouncedBy: 'email_check' },
        });
      }

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
            data: { status: 'completed' },
          });
        }
      }
    } catch (error) {
      console.error(`[EMAIL_CHECK] error processing job ${job.id}`, error);

      await this.prisma.emailCheck.update({
        where: { id: emailCheckId },
        data: { status: 'failed', result: 'unknown' },
      });

      throw error;
    }
  }
}
