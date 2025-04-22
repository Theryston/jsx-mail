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
import { Worker } from 'bullmq';
import { MarkedBounceTo, Message } from '@prisma/client';
import { GetUserLimitsService } from '../user/services/get-user-limits.service';
import { PERMISSIONS } from 'src/auth/permissions';
import { UpdateMessageStatusService } from './services/update-message-status.service';
import { GetSettingsService } from '../user/services/get-settings.service';
import { MarkBounceToService } from './services/mark-bounce-to.service';

const transporter = nodemailer.createTransport({
  SES: { aws, ses: sesClient },
});

@Processor('email', { concurrency: 40, limiter: { max: 10000, duration: 100 } })
export class EmailProcessor extends WorkerHost {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('email') private readonly queue: Queue,
    private readonly getUserLimitsService: GetUserLimitsService,
    private readonly updateMessageStatusService: UpdateMessageStatusService,
    private readonly getSettingsService: GetSettingsService,
    private readonly markBounceToService: MarkBounceToService,
  ) {
    super();
  }

  async process(job: Job<SendEmailDto>): Promise<void> {
    const startTime = Date.now();

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
    } finally {
      const endTime = Date.now();
      const duration = endTime - startTime;
      console.log(
        `[EMAIL_PROCESSOR] job ${job.id} took ${duration}ms to complete`,
      );
    }
  }

  async sendEmail(data: SendEmailDto) {
    let dataLog: any = { ...data };
    delete dataLog.html;

    const settings = await this.getSettingsService.execute();

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

    if (messagesSentThisSecond >= settings.globalMaxMessagesPerSecond) {
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

    if (messagesSentThisDay >= settings.globalMaxMessagesPerDay) {
      console.log(
        `[EMAIL_PROCESSOR] rate day limit exceeded, waiting ${timeToWaitDay} milliseconds. Will reset at ${moment(Date.now() + timeToWaitDay).format('DD/MM/YYYY HH:mm:ss')}`,
      );
      await this.queue.rateLimit(timeToWaitDay);
      throw Worker.RateLimitError();
    }

    dataLog = JSON.stringify(dataLog);

    console.log(`[EMAIL_PROCESSOR] sending email: ${dataLog}`);

    const { from, attachmentIds } = data;

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
    let contactId: string | null = null;

    if (messageId) {
      message = await this.prisma.message.findUnique({
        where: { id: messageId },
      });

      if (!message) {
        console.error(`[EMAIL_PROCESSOR] message not found: ${messageId}`);
        return;
      }

      userId = message.userId;
      contactId = message.contactId;

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
          messageFiles: attachmentIds
            ? {
                create: attachmentIds.map((fileId) => ({
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
      contactId = message.contactId;

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

    if (contactId) {
      const contact = await this.prisma.contact.findUnique({
        where: { id: contactId },
        select: {
          bouncedAt: true,
          bouncedBy: true,
          email: true,
        },
      });

      if (contact?.bouncedAt) {
        await this.updateMessageStatusService.execute(
          messageId,
          'failed',
          `Ignored because contact ${contact?.email} is bounced by ${contact?.bouncedBy === 'email_check' ? 'email check' : 'previous bounced message'} at ${moment(contact?.bouncedAt).format('DD/MM/YYYY HH:mm:ss')}`,
          {
            skipBounceToCheck: 'true',
          },
        );

        return;
      }
    }

    let detectedMarkedBounceTo: MarkedBounceTo | null = null;

    for (const to of data.to) {
      const markedBounceTo = await this.markBounceToService.get(to);

      if (markedBounceTo) {
        detectedMarkedBounceTo = markedBounceTo;
        break;
      }
    }

    if (detectedMarkedBounceTo) {
      await this.updateMessageStatusService.execute(
        messageId,
        'bounce',
        `Bounced because this email was marked as bounce by ${detectedMarkedBounceTo.bounceBy === 'email_check' ? 'email check' : 'previous bounced message'} at ${moment(detectedMarkedBounceTo.createdAt).format('DD/MM/YYYY HH:mm:ss')}`,
        {
          smartBounce: 'true',
        },
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
        {
          is_blocked: 'true',
        },
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

    if (attachmentIds) {
      const files = await this.prisma.file.findMany({
        where: { id: { in: attachmentIds } },
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

    if (data.attachments) {
      for (const attachment of data.attachments) {
        attachments.push({
          filename: attachment.fileName,
          content: attachment.content,
          encoding: 'base64',
        });

        await this.prisma.messageAttachment.create({
          data: {
            messageId: messageId,
            fileName: attachment.fileName,
          },
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

    await this.updateMessageStatusService.execute(
      messageId,
      'sent',
      'Email sent successfully',
      undefined,
      {
        externalId: externalMessageId,
      },
    );

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
