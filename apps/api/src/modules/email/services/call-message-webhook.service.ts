import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class CallMessageWebhookService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(messageId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
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

    try {
      await axios.post(webhook, {
        messageId: message.id,
        status: message.status,
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
