import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { SendEmailDto } from './email.dto';
import * as aws from '@aws-sdk/client-ses';
import { PrismaService } from 'src/services/prisma.service';
import { sesClient } from '../domain/ses';
import nodemailer from 'nodemailer';
import axios from 'axios';
import handlebars from 'handlebars';
import moment from 'moment';
import {
  MAX_MESSAGES_PER_DAY,
  MAX_MESSAGES_PER_SECOND,
} from 'src/utils/constants';
import { Worker } from 'bullmq';
import { Message } from '@prisma/client';

const transporter = nodemailer.createTransport({
  SES: { aws, ses: sesClient },
});

@Processor('email', { concurrency: 1, limiter: { max: 10000, duration: 100 } })
export class EmailProcessor extends WorkerHost {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('email') private readonly queue: Queue,
  ) {
    super();
  }

  async process(job: Job<SendEmailDto>): Promise<void> {
    console.log(`[EMAIL_PROCESSOR] received job: ${JSON.stringify(job.id)}`);

    if (job.name === 'send-email') {
      await this.sendEmail(job.data);
      return;
    }

    throw new Error('Invalid job name');
  }

  async sendEmail(data: SendEmailDto) {
    let dataLog: any = { ...data };
    delete dataLog.html;

    const currentSecond = moment().startOf('second');
    const timeToWait = moment().diff(currentSecond, 'milliseconds');

    const messagesSentThisSecond = await this.prisma.message.count({
      where: {
        status: {
          not: 'queued',
        },
        createdAt: {
          gte: currentSecond.toDate(),
        },
      },
    });

    if (messagesSentThisSecond >= MAX_MESSAGES_PER_SECOND) {
      console.log(
        `[EMAIL_PROCESSOR] rate second limit exceeded, waiting ${timeToWait} milliseconds`,
      );
      await this.queue.rateLimit(timeToWait);
      throw Worker.RateLimitError();
    }

    const currentDay = moment().startOf('day');
    const timeToWaitDay = moment().diff(currentDay, 'milliseconds');
    const messagesSentThisDay = await this.prisma.message.count({
      where: {
        status: {
          not: 'queued',
        },
        createdAt: { gte: currentDay.toDate() },
      },
    });

    if (messagesSentThisDay >= MAX_MESSAGES_PER_DAY) {
      console.log(
        `[EMAIL_PROCESSOR] rate day limit exceeded, waiting ${timeToWaitDay} milliseconds`,
      );
      await this.queue.rateLimit(timeToWaitDay);
      throw Worker.RateLimitError();
    }

    dataLog = JSON.stringify(dataLog);

    console.log(`[EMAIL_PROCESSOR] sending email: ${dataLog}`);

    const { from, to, messageId, filesIds } = data;

    let message: Message | null = null;
    if (messageId) {
      message = await this.prisma.message.findUnique({
        where: { id: messageId },
      });

      await this.prisma.message.update({
        where: { id: messageId },
        data: { status: 'processing' },
      });

      if (message.bulkSendingId) {
        await this.prisma.bulkSending.update({
          where: { id: message.bulkSendingId },
          data: {
            status: 'processing',
            processedContacts: {
              increment: 1,
            },
          },
        });
      }
    }

    let html = data.html;
    let subject = data.subject;

    if (data.customPayload) {
      const templateHtml = handlebars.compile(data.html);
      html = templateHtml(data.customPayload);

      const templateSubject = handlebars.compile(data.subject);
      subject = templateSubject(data.customPayload);
    }

    let attachments: any[] = [];

    if (filesIds) {
      const files = await this.prisma.file.findMany({
        where: { id: { in: filesIds } },
      });

      for (const file of files) {
        const { data: bytes } = await axios.get(file.url, {
          responseType: 'arraybuffer',
        });

        const base64 = Buffer.from(bytes).toString('base64');

        attachments.push({
          filename: file.originalName,
          content: base64,
          encoding: 'base64',
        });
      }
    }

    const { response: externalMessageId } = await transporter.sendMail({
      from: `"${from.name}" <${from.email}>`,
      to,
      subject,
      html,
      attachments,
      ses: {
        ConfigurationSetName: process.env.AWS_SES_CONFIGURATION_SET as string,
      },
    } as any);

    console.log(
      `[EMAIL_PROCESSOR] email sent from ${from.email} to ${to} with subject ${subject}`,
    );

    if (!messageId) {
      console.log(`[EMAIL_PROCESSOR] messageId not found, ignoring`);
      return;
    }

    if (!message) {
      console.error(`[EMAIL_PROCESSOR] message not found: ${messageId}`);
      return;
    }

    await this.prisma.message.update({
      where: {
        id: messageId,
      },
      data: {
        externalId: externalMessageId,
      },
    });

    console.log(
      `[EMAIL_PROCESSOR] updated message: ${messageId} to add externalId: ${externalMessageId}`,
    );

    if (!message.bulkSendingId) {
      console.log(
        `[EMAIL_PROCESSOR] message is not part of a bulk sending, ignoring`,
      );
      return;
    }

    const queuedMessages = await this.prisma.message.count({
      where: {
        bulkSendingId: message.bulkSendingId,
        status: 'queued',
      },
    });

    if (queuedMessages !== 0) {
      console.log(
        `[EMAIL_PROCESSOR] there are ${queuedMessages} messages in the queue for bulk sending ${message.bulkSendingId}, not updating status`,
      );
      return;
    }

    const bulkSending = await this.prisma.bulkSending.findUnique({
      where: { id: message.bulkSendingId },
    });

    if (!bulkSending) {
      console.error(
        `[EMAIL_PROCESSOR] bulk sending not found: ${message.bulkSendingId}`,
      );
      return;
    }

    if (bulkSending.status === 'failed') {
      console.log(
        `[EMAIL_PROCESSOR] bulk sending ${message.bulkSendingId} is failed, not updating status`,
      );
      return;
    }

    await this.prisma.bulkSending.update({
      where: { id: message.bulkSendingId },
      data: { status: 'completed' },
    });
  }
}
