import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/services/prisma.service';
import { messageSelect } from 'src/utils/public-selects';

@Injectable()
export class CallMessageWebhookService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(messageId: string) {
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

    const webhook = message.webhookUrl;
    const status = message.webhookStatus;

    if (!webhook) {
      console.log(
        `[CALL_MESSAGE_WEBHOOK_SERVICE] message ${message.id} has no webhook`,
      );
      return;
    }

    if (status.length !== 0 && !status.includes(message.status)) {
      console.log(
        `[CALL_MESSAGE_WEBHOOK_SERVICE] message ${message.id} has status ${message.status} but webhook status is ${status}`,
      );
      return;
    }

    const newMessageId = message.id;

    delete message.id;

    try {
      await axios.post(webhook, {
        messageId: newMessageId,
        ...message,
      });
    } catch (error) {
      const errorMessage = error.response?.data || error.message;
      console.log(
        `[CALL_MESSAGE_WEBHOOK_SERVICE] error calling webhook ${webhook} for message ${message.id} for status ${message.status}: `,
        errorMessage,
      );
    }

    console.log(
      `[CALL_MESSAGE_WEBHOOK_SERVICE] successfully called webhook ${webhook} for message ${message.id} for status ${message.status}`,
    );

    return true;
  }
}
