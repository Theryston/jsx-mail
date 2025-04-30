import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { SendEmailDto } from './email.dto';
import * as aws from '@aws-sdk/client-ses';
import { sesClient } from '../domain/ses';
import nodemailer from 'nodemailer';
import axios from 'axios';
import handlebars from 'handlebars';
import moment from 'moment';
import { Worker } from 'bullmq';
import { Message, PrismaClient } from '@prisma/client';
import { GetUserLimitsService } from '../user/services/get-user-limits.service';
import { PERMISSIONS } from 'src/auth/permissions';
import { UpdateMessageStatusService } from './services/update-message-status.service';
import { GetSettingsService } from '../user/services/get-settings.service';
import { MarkBounceToService } from './services/mark-bounce-to.service';
import { MarkComplaintToService } from './services/mark-complaint-to.service';
import { CustomPrismaService } from 'nestjs-prisma';
import { Inject } from '@nestjs/common';

const transporter = nodemailer.createTransport({
  SES: { aws, ses: sesClient },
});

class RateLimiter {
  private messageCountBySecond: Map<string, number> = new Map();
  private messageCountByDay: Map<string, number> = new Map();
  private settings: any = null;
  private lastSettingsCheck: number = 0;
  private settingsCheckInterval: number = 60000; // 1 minute

  constructor(private getSettingsService: GetSettingsService) {}

  async getSettings() {
    const now = Date.now();
    if (
      !this.settings ||
      now - this.lastSettingsCheck > this.settingsCheckInterval
    ) {
      this.settings = await this.getSettingsService.execute();
      this.lastSettingsCheck = now;
    }
    return this.settings;
  }

  async incrementAndCheckSecond(
    prisma: CustomPrismaService<PrismaClient>,
  ): Promise<{ allowed: boolean; waitTime: number }> {
    const settings = await this.getSettings();
    const currentSecondKey = moment().format('YYYY-MM-DD-HH-mm-ss');

    if (!this.messageCountBySecond.has(currentSecondKey)) {
      const currentSecond = moment().startOf('second');
      const count = await prisma.client.message.count({
        where: {
          status: { not: 'queued' },
          createdAt: { gte: currentSecond.toDate() },
        },
      });

      for (const key of this.messageCountBySecond.keys()) {
        if (key !== currentSecondKey) {
          this.messageCountBySecond.delete(key);
        }
      }

      this.messageCountBySecond.set(currentSecondKey, count);
    }

    const currentCount =
      (this.messageCountBySecond.get(currentSecondKey) || 0) + 1;

    this.messageCountBySecond.set(currentSecondKey, currentCount);

    if (currentCount > settings.globalMaxMessagesPerSecond) {
      const nextSecond = moment().add(1, 'second').startOf('second');
      const waitTime = nextSecond.diff(moment(), 'milliseconds');
      return { allowed: false, waitTime };
    }

    return { allowed: true, waitTime: 0 };
  }

  async incrementAndCheckDay(
    prisma: CustomPrismaService<PrismaClient>,
  ): Promise<{ allowed: boolean; waitTime: number }> {
    const settings = await this.getSettings();
    const currentDayKey = moment().format('YYYY-MM-DD');

    if (!this.messageCountByDay.has(currentDayKey)) {
      const currentDay = moment().startOf('day');
      const count = await prisma.client.message.count({
        where: {
          status: { not: 'queued' },
          createdAt: { gte: currentDay.toDate() },
        },
      });

      for (const key of this.messageCountByDay.keys()) {
        if (key !== currentDayKey) {
          this.messageCountByDay.delete(key);
        }
      }

      this.messageCountByDay.set(currentDayKey, count);
    }

    const currentCount = (this.messageCountByDay.get(currentDayKey) || 0) + 1;

    this.messageCountByDay.set(currentDayKey, currentCount);

    if (currentCount > settings.globalMaxMessagesPerDay) {
      const tomorrow = moment().add(1, 'day').startOf('day');
      const waitTime = tomorrow.diff(moment(), 'milliseconds');
      return { allowed: false, waitTime };
    }

    return { allowed: true, waitTime: 0 };
  }
}

@Processor('email', {
  concurrency: Number(process.env.EMAIL_PROCESSOR_CONCURRENCY || 12),
  limiter: { max: 10000, duration: 100 },
})
export class EmailProcessor extends WorkerHost {
  private rateLimiter: RateLimiter;

  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
    @InjectQueue('email') private readonly queue: Queue,
    private readonly getUserLimitsService: GetUserLimitsService,
    private readonly updateMessageStatusService: UpdateMessageStatusService,
    private readonly getSettingsService: GetSettingsService,
    private readonly markBounceToService: MarkBounceToService,
    private readonly markComplaintToService: MarkComplaintToService,
  ) {
    super();
    this.rateLimiter = new RateLimiter(this.getSettingsService);
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
    dataLog = JSON.stringify(dataLog);

    console.log(`[EMAIL_PROCESSOR] sending email: ${dataLog}`);

    const secondRateCheck = await this.rateLimiter.incrementAndCheckSecond(
      this.prisma,
    );

    if (!secondRateCheck.allowed) {
      console.log(
        `[EMAIL_PROCESSOR] rate second limit exceeded, waiting ${secondRateCheck.waitTime} milliseconds. Will reset at ${moment(Date.now() + secondRateCheck.waitTime).format('DD/MM/YYYY HH:mm:ss')}`,
      );
      await this.queue.rateLimit(secondRateCheck.waitTime);
      throw Worker.RateLimitError();
    }

    const dayRateCheck = await this.rateLimiter.incrementAndCheckDay(
      this.prisma,
    );

    if (!dayRateCheck.allowed) {
      console.log(
        `[EMAIL_PROCESSOR] rate day limit exceeded, waiting ${dayRateCheck.waitTime} milliseconds. Will reset at ${moment(Date.now() + dayRateCheck.waitTime).format('DD/MM/YYYY HH:mm:ss')}`,
      );
      await this.queue.rateLimit(dayRateCheck.waitTime);
      throw Worker.RateLimitError();
    }

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
      message = await this.prisma.client.message.findUnique({
        where: { id: messageId },
      });

      if (!message) {
        console.error(`[EMAIL_PROCESSOR] message not found: ${messageId}`);
        return;
      }

      userId = message.userId;
      contactId = message.contactId;

      // Update message status to processing in background
      this.updateMessageStatusService
        .execute(messageId, 'processing', 'Processing email')
        .catch((error) =>
          console.error(
            `[EMAIL_PROCESSOR] error updating message status: ${error}`,
          ),
        );
    } else {
      console.log(
        `[EMAIL_PROCESSOR] creating message for ${to} with default sender ${process.env.DEFAULT_SENDER_EMAIL} and domain ${process.env.DEFAULT_EMAIL_DOMAIN_NAME}`,
      );

      message = await this.prisma.client.message.create({
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

      // Create message status history in background
      this.prisma.client.messageStatusHistory
        .create({
          data: {
            messageId: message.id,
            status: 'processing',
            description: 'Created message and started processing the email',
          },
        })
        .catch((error) =>
          console.error(
            `[EMAIL_PROCESSOR] error creating message status history: ${error}`,
          ),
        );

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
      const contact = await this.prisma.client.contact.findUnique({
        where: { id: contactId },
        select: {
          bouncedAt: true,
          bouncedBy: true,
          email: true,
        },
      });

      if (contact?.bouncedAt) {
        this.updateMessageStatusService
          .execute(
            messageId,
            'failed',
            `Ignored because contact ${contact?.email} is bounced by ${contact?.bouncedBy === 'email_check' ? 'email check' : 'previous bounced message'} at ${moment(contact?.bouncedAt).format('DD/MM/YYYY HH:mm:ss')}`,
            {
              skipBounceToCheck: 'true',
            },
          )
          .catch((error) =>
            console.error(
              `[EMAIL_PROCESSOR] error updating message status: ${error}`,
            ),
          );

        return;
      }
    }

    const markedBounceToPromise = Promise.all(
      data.to.map((to) => this.markBounceToService.get(to)),
    ).then((results) => results.find((result) => result !== null));

    const markedComplaintToPromise = Promise.all(
      data.to.map((to) => this.markComplaintToService.get(to, userId)),
    ).then((results) => results.find((result) => result !== null));

    const isBlockedPromise = this.prisma.client.blockedPermission.findFirst({
      where: {
        userId,
        permission: PERMISSIONS.SELF_SEND_EMAIL.value,
      },
    });

    const userLimitsPromise = this.getUserLimitsService.execute(userId);

    const [
      detectedMarkedBounceTo,
      detectedMarkedComplaintTo,
      isBlockedToSendEmail,
      userLimits,
    ] = await Promise.all([
      markedBounceToPromise,
      markedComplaintToPromise,
      isBlockedPromise,
      userLimitsPromise,
    ]);

    if (detectedMarkedBounceTo) {
      this.updateMessageStatusService
        .execute(
          messageId,
          'bounce',
          `Bounced because this email was marked as bounce by ${detectedMarkedBounceTo.bounceBy === 'email_check' ? 'email check' : 'previous bounced message'} at ${moment(detectedMarkedBounceTo.createdAt).format('DD/MM/YYYY HH:mm:ss')}`,
          {
            smartBounce: 'true',
          },
        )
        .catch((error) =>
          console.error(
            `[EMAIL_PROCESSOR] error updating message status: ${error}`,
          ),
        );

      return;
    }

    if (detectedMarkedComplaintTo) {
      this.updateMessageStatusService
        .execute(
          messageId,
          'complaint',
          `Complaint because this email was marked as complaint at ${moment(detectedMarkedComplaintTo.createdAt).format('DD/MM/YYYY HH:mm:ss')}`,
          {
            smartComplaint: 'true',
          },
        )
        .catch((error) =>
          console.error(
            `[EMAIL_PROCESSOR] error updating message status: ${error}`,
          ),
        );

      return;
    }

    if (isBlockedToSendEmail) {
      this.updateMessageStatusService
        .execute(
          messageId,
          'failed',
          'Failed because user is blocked to send email',
          {
            is_blocked: 'true',
          },
        )
        .catch((error) =>
          console.error(
            `[EMAIL_PROCESSOR] error updating message status: ${error}`,
          ),
        );

      console.log(
        `[EMAIL_PROCESSOR] user ${userId} is blocked to send email, not sending email`,
      );

      return;
    }

    if (userLimits.availableMessages <= 0) {
      console.log(
        `[EMAIL_PROCESSOR] insufficient balance for user ${userId}, not sending email`,
      );

      this.updateMessageStatusService
        .execute(messageId, 'failed', 'Failed because user has no balance')
        .catch((error) =>
          console.error(
            `[EMAIL_PROCESSOR] error updating message status: ${error}`,
          ),
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
      const files = await this.prisma.client.file.findMany({
        where: { id: { in: attachmentIds } },
      });

      const attachmentPromises = files.map(async (file) => {
        try {
          const { data: bytes } = await axios.get(file.url, {
            responseType: 'arraybuffer',
          });

          const base64 = Buffer.from(bytes).toString('base64');
          return {
            filename: file.originalName,
            content: base64,
            encoding: 'base64',
          };
        } catch (error) {
          console.error(
            `[EMAIL_PROCESSOR] error downloading attachment: ${error}`,
          );
          return null;
        }
      });

      const downloadedAttachments = await Promise.all(attachmentPromises);
      attachments = downloadedAttachments.filter(Boolean);
    }

    if (data.attachments) {
      for (const attachment of data.attachments) {
        attachments.push({
          filename: attachment.fileName,
          content: attachment.content,
          encoding: 'base64',
        });

        this.prisma.client.messageAttachment
          .create({
            data: {
              messageId: messageId,
              fileName: attachment.fileName,
            },
          })
          .catch((error) =>
            console.error(
              `[EMAIL_PROCESSOR] error creating message attachment: ${error}`,
            ),
          );
      }
    }

    try {
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

      this.updateMessageStatusService
        .execute(messageId, 'sent', 'Email sent successfully', undefined, {
          externalId: externalMessageId,
        })
        .catch((error) =>
          console.error(
            `[EMAIL_PROCESSOR] error updating message status: ${error}`,
          ),
        );

      console.log(
        `[EMAIL_PROCESSOR] updated message: ${messageId} to add externalId: ${externalMessageId}`,
      );
    } catch (error) {
      console.error(`[EMAIL_PROCESSOR] error sending email: ${error}`);

      this.updateMessageStatusService
        .execute(messageId, 'failed', `Failed to send email: ${error.message}`)
        .catch((err) =>
          console.error(
            `[EMAIL_PROCESSOR] error updating message status: ${err}`,
          ),
        );
    }
  }
}
