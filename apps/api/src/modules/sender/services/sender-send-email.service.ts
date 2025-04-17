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

@Injectable()
export class SenderSendEmailService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sendEmailService: SendEmailService,
    private readonly betaPermissionCheckService: BetaPermissionCheckService,
    private readonly getUserLimitsService: GetUserLimitsService,
    private readonly callMessageWebhookService: CallMessageWebhookService,
  ) {}

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

    let sender: Sender | null = null;

    if (senderEmail) {
      sender = await this.prisma.sender.findFirst({
        where: {
          email: senderEmail,
          userId,
          deletedAt: null,
        },
      });
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
    }

    if (!sender) {
      throw new HttpException(
        'Sender not found, please create one',
        HttpStatus.NOT_FOUND,
      );
    }

    const { availableMessages } =
      await this.getUserLimitsService.execute(userId);

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

    await this.prisma.messageStatusHistory.create({
      data: {
        messageId: message.id,
        status: 'queued',
        description: 'Added email to queue',
      },
    });

    await this.sendEmailService.execute({
      from: {
        name: sender.name,
        email: sender.email,
      },
      html,
      subject,
      to,
      messageId: message.id,
      attachmentIds,
      attachments,
      bulkSendingId,
      customPayload,
      delay,
      priority,
    });

    await this.callMessageWebhookService.execute(message.id);

    return message;
  }
}
