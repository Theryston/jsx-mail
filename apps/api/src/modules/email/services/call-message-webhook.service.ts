import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { messageSelect } from 'src/utils/public-selects';
import { MessageStatus, PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class CallMessageWebhookService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute(messageId: string, customStatus?: MessageStatus) {
    const message = await this.prisma.client.message.findUnique({
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

    const userWebhooks = await this.prisma.client.userWebhook.findMany({
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

      const toEmailOnly = message.to.map((to) => {
        const match = to.match(/<([^>]+)>/);
        if (match) {
          return match[1];
        }
        return to;
      });

      try {
        await axios.post(webhook, {
          messageId: newMessageId,
          ...message,
          status: messageStatus,
          toEmailOnly,
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
