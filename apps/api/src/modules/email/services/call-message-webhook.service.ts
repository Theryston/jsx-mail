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

    const webhook = message.webhookUrl;
    const status = message.webhookStatus;
    const messageStatus = customStatus || message.status;
    const newMessageId = message.id;
    delete message.id;

    if (!webhook) {
      console.log(
        `[CALL_MESSAGE_WEBHOOK_SERVICE] message ${newMessageId} has no webhook`,
      );
      return;
    }

    if (status.length !== 0 && !status.includes(messageStatus)) {
      console.log(
        `[CALL_MESSAGE_WEBHOOK_SERVICE] message ${newMessageId} has status ${messageStatus} but webhook status is ${status}`,
      );
      return;
    }

    try {
      await axios.post(webhook, {
        messageId: newMessageId,
        ...message,
      });
    } catch (error) {
      const errorMessage = error.response?.data || error.message;
      console.log(
        `[CALL_MESSAGE_WEBHOOK_SERVICE] error calling webhook ${webhook} for message ${newMessageId} for status ${messageStatus}: `,
        errorMessage,
      );
    }

    console.log(
      `[CALL_MESSAGE_WEBHOOK_SERVICE] successfully called webhook ${webhook} for message ${newMessageId} for status ${messageStatus}`,
    );

    return true;
  }
}
