import { Injectable } from '@nestjs/common';
import { MessageStatus } from '@prisma/client';
import { PrismaService } from 'src/services/prisma.service';
import { CheckUserEmailStatsService } from './check-user-email-stats.service';
import { UpdateMessageStatusService } from './update-message-status.service';

@Injectable()
export class EmailWebhookService {
  constructor(
    private prisma: PrismaService,
    private checkUserEmailStatsService: CheckUserEmailStatsService,
    private updateMessageStatusService: UpdateMessageStatusService,
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

      await this.updateMessageStatusService.execute(message.id, newStatus);

      if (newStatus === 'bonce' || newStatus === 'complaint') {
        await this.checkUserEmailStatsService.execute(message.userId);
      }
    } catch (error) {
      console.log('[EMAIL_WEBHOOK_SERVICE] error: ', error);
      return 'event processed but there was an error';
    }
  }
}
