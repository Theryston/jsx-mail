import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SendEmailService } from 'src/modules/email/services/send-email.service';
import { PrismaService } from 'src/services/prisma.service';
import { SenderSendEmailDto } from '../sender.dto';
import { messageSelect } from 'src/utils/public-selects';
import moment from 'moment';
import { Sender } from '@prisma/client';
import { BetaPermissionCheckService } from 'src/modules/user/services/beta-permission-check.service';
import { PERMISSIONS } from 'src/auth/permissions';
import { GetUserLimitsService } from 'src/modules/user/services/get-user-limits.service';
import { CallMessageWebhookService } from 'src/modules/email/services/call-message-webhook.service';
import { LRUCache } from 'lru-cache';

@Injectable()
export class SenderSendEmailService {
  private readonly senderCache: LRUCache<string, Sender | null>;
  private readonly defaultSenderCache: LRUCache<string, Sender | null>;
  private readonly userLimitsCache: LRUCache<
    string,
    { availableMessages: number }
  >;

  constructor(
    private readonly prisma: PrismaService,
    private readonly sendEmailService: SendEmailService,
    private readonly betaPermissionCheckService: BetaPermissionCheckService,
    private readonly getUserLimitsService: GetUserLimitsService,
    private readonly callMessageWebhookService: CallMessageWebhookService,
  ) {
    this.senderCache = new LRUCache<string, Sender | null>({
      max: 1000,
      ttl: 1000 * 60 * 10,
    });

    this.defaultSenderCache = new LRUCache<string, Sender | null>({
      max: 1000,
      ttl: 1000 * 60 * 10,
    });

    this.userLimitsCache = new LRUCache<string, { availableMessages: number }>({
      max: 1000,
      ttl: 1000 * 10,
    });
  }

  async execute(
    {
      sender: senderEmail,
      html,
      subject,
      to,
      attachmentIds,
      attachments,
      bulkSendingId,
      customPayload,
      contactId,
      delay,
      priority,
      webhook,
    }: SenderSendEmailDto,
    userId: string,
  ) {
    if (
      (attachmentIds && attachmentIds.length > 0) ||
      (attachments && attachments.length > 0)
    ) {
      await this.betaPermissionCheckService.execute(userId, [
        PERMISSIONS.SELF_SEND_EMAIL_WITH_ATTACHMENTS.value,
      ]);
    }

    const sender = await this.getSender(userId, senderEmail);

    if (!sender) {
      throw new HttpException(
        'Sender not found, please create one',
        HttpStatus.NOT_FOUND,
      );
    }

    const { availableMessages } = await this.getUserLimits(userId);

    if (availableMessages <= 0) {
      throw new HttpException('Insufficient balance', HttpStatus.BAD_REQUEST);
    }

    let message = await this.prisma.message.create({
      data: {
        status: 'queued',
        body: html,
        subject,
        to,
        domainId: sender.domainId,
        senderId: sender.id,
        userId,
        contactId,
        webhookUrl: webhook?.url,
        webhookStatus: webhook?.status || [],
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
        bulkSendingId,
        customPayload: customPayload
          ? JSON.stringify(customPayload)
          : undefined,
      },
      select: messageSelect,
    });

    this.prisma.messageStatusHistory
      .create({
        data: {
          messageId: message.id,
          status: 'queued',
          description: 'Added email to queue',
        },
      })
      .catch((error) => {
        console.log(
          `Error creating message status history in background: `,
          error,
        );
      });

    this.sendEmailService
      .execute({
        from: {
          name: sender.name,
          email: sender.email,
        },
        html,
        subject,
        to,
        userId,
        messageId: message.id,
        attachmentIds,
        attachments,
        bulkSendingId,
        customPayload,
        delay,
        priority,
      })
      .catch((error) => {
        console.log(`Error sending email to queue in background: `, error);
      });

    this.userLimitsCache.set(`userLimits:${userId}`, {
      availableMessages: availableMessages - 1,
    });

    await this.callMessageWebhookService.execute(message.id);

    return message;
  }

  private getSenderCacheKey(userId: string, email?: string): string {
    return `sender:${userId}:${email || 'default'}`;
  }

  private async getSender(
    userId: string,
    email?: string,
  ): Promise<Sender | null> {
    const cacheKey = this.getSenderCacheKey(userId, email);

    if (email && this.senderCache.has(cacheKey)) {
      return this.senderCache.get(cacheKey) || null;
    }

    if (!email && this.defaultSenderCache.has(cacheKey)) {
      return this.defaultSenderCache.get(cacheKey) || null;
    }

    let sender: Sender | null = null;

    if (email) {
      sender = await this.prisma.sender.findFirst({
        where: {
          email,
          userId,
          deletedAt: null,
        },
      });

      this.senderCache.set(cacheKey, sender);
    } else {
      sender = await this.prisma.sender.findFirst({
        where: {
          userId,
          deletedAt: null,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      this.defaultSenderCache.set(cacheKey, sender);
    }

    return sender;
  }

  private async getUserLimits(
    userId: string,
  ): Promise<{ availableMessages: number }> {
    const cacheKey = `userLimits:${userId}`;

    if (this.userLimitsCache.has(cacheKey)) {
      return this.userLimitsCache.get(cacheKey) as {
        availableMessages: number;
      };
    }

    const limits = await this.getUserLimitsService.execute(userId);

    this.userLimitsCache.set(cacheKey, limits);

    return limits;
  }
}
