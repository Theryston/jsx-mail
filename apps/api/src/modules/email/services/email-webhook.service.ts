import { Injectable } from '@nestjs/common';
import { MessageStatus } from '@prisma/client';
import moment from 'moment';
import { PrismaService } from 'src/services/prisma.service';
import { CheckUserEmailStatsService } from './check-user-email-stats.service';

@Injectable()
export class EmailWebhookService {
  constructor(
    private prisma: PrismaService,
    private checkUserEmailStatsService: CheckUserEmailStatsService,
  ) {}

  async execute(data: any) {
    try {
      const externalId = data?.mail?.messageId;
      if (!externalId) return 'ignored because the externalId is missing';
      console.log(`[EMAIL_WEBHOOK_SERVICE] received data from: ${externalId}`);

      const newStatus: MessageStatus | undefined = {
        Send: 'sent',
        RenderingFailure: 'failed',
        Reject: 'reject',
        Delivery: 'delivered',
        Bounce: 'bonce',
        Complaint: 'complaint',
        DeliveryDelay: 'delivery_delay',
        Subscription: 'subscription',
        Open: 'opened',
        Click: 'clicked',
      }[data?.eventType];

      if (!newStatus) return 'ignored because the status was not found';

      const message = await this.prisma.message.findFirst({
        where: {
          externalId,
          deletedAt: null,
          domain: {
            deletedAt: null,
          },
        },
      });

      if (!message) return 'ignored because the message was not found';

      if (this.shouldNotUpdateStatus(message.status, newStatus)) {
        console.log(
          `[EMAIL_WEBHOOK_SERVICE] ignoring status update from ${message.status} to ${newStatus}`,
        );
        return `ignored because the message already has a higher priority status: ${message.status}`;
      }

      console.log(
        `[EMAIL_WEBHOOK_SERVICE] updating status from ${message.status} to ${newStatus}`,
      );

      await this.prisma.message.update({
        where: {
          id: message.id,
        },
        data: {
          status: newStatus,
          ...(newStatus === 'sent'
            ? {
                sentAt: new Date(),
                chargeMonth: moment().format('YYYY-MM'),
                sentDay: moment().format('YYYY-MM-DD'),
              }
            : {}),
        },
      });

      if (newStatus === 'bonce' || newStatus === 'complaint') {
        await this.checkUserEmailStatsService.execute(message.userId);
      }
    } catch (error) {
      console.log('[EMAIL_WEBHOOK_SERVICE] error: ', error);
      return 'event processed but there was an error';
    }
  }

  private shouldNotUpdateStatus(
    currentStatus: MessageStatus,
    newStatus: MessageStatus,
  ): boolean {
    const statusPriority: Record<MessageStatus, number> = {
      clicked: 5,
      opened: 4,
      bonce: 3,
      delivered: 2,
      sent: 1,
      complaint: 1,
      failed: 1,
      reject: 1,
      delivery_delay: 1,
      subscription: 1,
      queued: 0,
      processing: 0,
    };

    return (
      (statusPriority[currentStatus] || 0) > (statusPriority[newStatus] || 0)
    );
  }
}
