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
import { GetUserLimitsService } from '../user/services/get-user-limits.service';
import { PERMISSIONS } from 'src/auth/permissions';
import { UpdateMessageStatusService } from './services/update-message-status.service';

const transporter = nodemailer.createTransport({
  SES: { aws, ses: sesClient },
});

@Processor('email', { concurrency: 10, limiter: { max: 10000, duration: 100 } })
export class EmailProcessor extends WorkerHost {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('email') private readonly queue: Queue,
    private readonly getUserLimitsService: GetUserLimitsService,
    private readonly updateMessageStatusService: UpdateMessageStatusService,
  ) {
    super();
  }

  async process(job: Job<SendEmailDto>): Promise<void> {
    try {
      console.log(`[EMAIL_PROCESSOR] received job id: ${job.id}`);

      if (job.name === 'send-email') {
        await this.sendEmail(job.data);
        return;
      }

      throw new Error('Invalid job name');
    } catch (error) {
      console.error(
        `[EMAIL_PROCESSOR] error processing job ${job.id}: `,
        error,
      );
      throw error;
    }
  }

  async sendEmail(data: SendEmailDto) {
    let dataLog: any = { ...data };
    delete dataLog.html;

    const currentSecond = moment().startOf('second');
    const nextSecond = moment().add(1, 'second').startOf('second');
    const timeToWait = nextSecond.diff(moment(), 'milliseconds');

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
        `[EMAIL_PROCESSOR] rate second limit exceeded, waiting ${timeToWait} milliseconds. Will reset at ${moment(Date.now() + timeToWait).format('DD/MM/YYYY HH:mm:ss')}`,
      );
      await this.queue.rateLimit(timeToWait);
      throw Worker.RateLimitError();
    }

    const currentDay = moment().startOf('day');
    const tomorrow = moment().add(1, 'day').startOf('day');
    const timeToWaitDay = tomorrow.diff(moment(), 'milliseconds');

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
        `[EMAIL_PROCESSOR] rate day limit exceeded, waiting ${timeToWaitDay} milliseconds. Will reset at ${moment(Date.now() + timeToWaitDay).format('DD/MM/YYYY HH:mm:ss')}`,
      );
      await this.queue.rateLimit(timeToWaitDay);
      throw Worker.RateLimitError();
    }

    dataLog = JSON.stringify(dataLog);

    console.log(`[EMAIL_PROCESSOR] sending email: ${dataLog}`);

    const { from, filesIds } = data;

    let to: string[] = data.to;

    if (
      process.env.NODE_ENV === 'development' &&
      !to.find((t) => t.includes(process.env.DEFAULT_USER_EMAIL as string))
    ) {
      let newTo = 'success@simulator.amazonses.com';

      if (data.to.find((t) => t.includes('bounce'))) {
        newTo = 'bounce@simulator.amazonses.com';
      }

      if (data.to.find((t) => t.includes('complaint'))) {
        newTo = 'complaint@simulator.amazonses.com';
      }

      console.log(
        `[EMAIL_PROCESSOR] changing to to ${to} to ${newTo} in development mode`,
      );
      to = [newTo];
    }

    let messageId: string | null = data.messageId || null;
    let message: Message | null = null;
    let userId: string | null = null;

    if (messageId) {
      message = await this.prisma.message.findUnique({
        where: { id: messageId },
      });

      if (!message) {
        console.error(`[EMAIL_PROCESSOR] message not found: ${messageId}`);
        return;
      }

      userId = message.userId;

      await this.updateMessageStatusService.execute(
        messageId,
        'processing',
        'Processing email',
      );
    } else {
      console.log(
        `[EMAIL_PROCESSOR] creating message for ${to} with default sender ${process.env.DEFAULT_SENDER_EMAIL} and domain ${process.env.DEFAULT_EMAIL_DOMAIN_NAME}`,
      );

      message = await this.prisma.message.create({
        data: {
          body: data.html,
          subject: data.subject,
          to,
          status: 'processing',
          domain: {
            connect: {
              name: process.env.DEFAULT_EMAIL_DOMAIN_NAME as string,
            },
          },
          sender: {
            connect: {
              email: process.env.DEFAULT_SENDER_EMAIL as string,
            },
          },
          user: {
            connect: {
              email: process.env.DEFAULT_USER_EMAIL as string,
            },
          },
          createdDay: moment().format('YYYY-MM-DD'),
          messageFiles: filesIds
            ? {
                create: filesIds.map((fileId) => ({
                  file: {
                    connect: {
                      id: fileId,
                    },
                  },
                })),
              }
            : undefined,
          bulkSending: data.bulkSendingId
            ? {
                connect: {
                  id: data.bulkSendingId,
                },
              }
            : undefined,
          customPayload: data.customPayload
            ? JSON.stringify(data.customPayload)
            : undefined,
        },
      });

      await this.prisma.messageStatusHistory.create({
        data: {
          messageId: message.id,
          status: 'processing',
          description: 'Created message and started processing the email',
        },
      });

      messageId = message.id;
      userId = message.userId;

      console.log(
        `[EMAIL_PROCESSOR] created message: ${messageId} for ${to} with default sender ${process.env.DEFAULT_SENDER_EMAIL} and domain ${process.env.DEFAULT_EMAIL_DOMAIN_NAME}`,
      );
    }

    if (!message || !messageId || !userId) {
      console.error(
        `[EMAIL_PROCESSOR] message or messageId or userId not found: ${messageId}`,
      );
      return;
    }

    const isBlockedToSendEmail = await this.prisma.blockedPermission.findFirst({
      where: {
        userId,
        permission: PERMISSIONS.SELF_SEND_EMAIL.value,
      },
    });

    if (isBlockedToSendEmail) {
      await this.updateMessageStatusService.execute(
        messageId,
        'failed',
        'Failed because user is blocked to send email',
      );

      console.log(
        `[EMAIL_PROCESSOR] user ${userId} is blocked to send email, not sending email`,
      );

      return;
    }

    const { availableMessages } =
      await this.getUserLimitsService.execute(userId);

    if (availableMessages <= 0) {
      console.log(
        `[EMAIL_PROCESSOR] insufficient balance for user ${userId}, not sending email`,
      );

      await this.updateMessageStatusService.execute(
        messageId,
        'failed',
        'Failed because user has no balance',
      );

      return;
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
