import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/services/prisma.service';
import { messageSelect } from 'src/utils/public-selects';
import { MessageStatus } from '@prisma/client';

@Injectable()
export class CallMessageWebhookService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(messageId: string, customStatus?: MessageStatus) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      select: {
        ...messageSelect,
        sender: {
          select: {
            email: true,
            name: true,
          },
        },
        statusHistory: {
          select: {
            id: true,
            createdAt: true,
            description: true,
            status: true,
            extras: {
              select: {
                key: true,
                value: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    const webhooks: {
      url: string;
      status: MessageStatus[];
    }[] = [];

    if (message.webhookUrl) {
      webhooks.push({
        url: message.webhookUrl,
        status: message.webhookStatus,
      });
    }

    const userWebhooks = await this.prisma.userWebhook.findMany({
      where: {
        userId: message.userId,
        messageStatuses: {
          has: customStatus || message.status,
        },
      },
      select: {
        url: true,
        messageStatuses: true,
      },
    });

    for (const webhook of userWebhooks) {
      webhooks.push({
        url: webhook.url,
        status: webhook.messageStatuses,
      });
    }

    const messageStatus = customStatus || message.status;
    const newMessageId = message.id;
    delete message.id;

    for (const currentWebhook of webhooks) {
      const webhook = currentWebhook.url;
      const status = currentWebhook.status;

      if (!webhook) {
        console.log(
          `[CALL_MESSAGE_WEBHOOK_SERVICE] message ${newMessageId} has no webhook`,
        );

        continue;
      }

      if (status.length !== 0 && !status.includes(messageStatus)) {
        console.log(
          `[CALL_MESSAGE_WEBHOOK_SERVICE] message ${newMessageId} has status ${messageStatus} but webhook status is ${status}`,
        );

        continue;
      }

      try {
        await axios.post(webhook, {
          messageId: newMessageId,
          ...message,
          status: messageStatus,
        });
      } catch (error) {
        const errorMessage = error.response?.data || error.message;
        console.log(
          `[CALL_MESSAGE_WEBHOOK_SERVICE] error calling webhook ${webhook} for message ${newMessageId} for status ${messageStatus}: `,
          errorMessage,
        );

        continue;
      }

      console.log(
        `[CALL_MESSAGE_WEBHOOK_SERVICE] successfully called webhook ${webhook} for message ${newMessageId} for status ${messageStatus}`,
      );
    }

    console.log(
      `[CALL_MESSAGE_WEBHOOK_SERVICE] successfully called ${webhooks.length} webhooks for message ${newMessageId} for status ${messageStatus}`,
    );

    return true;
  }
}
