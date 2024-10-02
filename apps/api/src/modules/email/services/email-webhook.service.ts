import { Injectable } from '@nestjs/common';
import { MessageStatus } from '@prisma/client';
import moment from 'moment';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class EmailWebhookService {
  constructor(private prisma: PrismaService) {}

  async execute(data: any) {
    console.log(
      `[EMAIL_WEBHOOK_SERVICE] received data: ${JSON.stringify(data)}`,
    );

    try {
      const externalId = data?.mail?.messageId;
      if (!externalId) return 'ignored because the externalId is missing';

      const status: MessageStatus | undefined = {
        Send: 'sent',
        RenderingFailure: 'failed',
        reject: 'reject',
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
          deletedAt: {
            isSet: false,
          },
          domain: {
            deletedAt: {
              isSet: false,
            },
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
                sentDay: moment().format('YYYY-MM-DD'),
              }
            : {}),
        },
      });
    } catch (error) {
      console.log('[EMAIL_WEBHOOK_SERVICE] error: ', error);
      return 'event processed but there was an error';
    }
  }
}
