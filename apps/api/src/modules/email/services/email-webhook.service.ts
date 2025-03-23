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

      const status: MessageStatus | undefined = {
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

      if (!status) return 'ignored because the status was not found';

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

      await this.prisma.message.update({
        where: {
          id: message.id,
        },
        data: {
          status,
          ...(status === 'sent'
            ? {
                sentAt: new Date(),
                chargeMonth: moment().format('YYYY-MM'),
                sentDay: moment().format('YYYY-MM-DD'),
              }
            : {}),
        },
      });

      // Verifica as taxas de bounce e complaint quando esses eventos ocorrem
      if (status === 'bonce' || status === 'complaint') {
        await this.checkUserEmailStatsService.execute(message.userId);
      }
    } catch (error) {
      console.log('[EMAIL_WEBHOOK_SERVICE] error: ', error);
      return 'event processed but there was an error';
    }
  }
}
