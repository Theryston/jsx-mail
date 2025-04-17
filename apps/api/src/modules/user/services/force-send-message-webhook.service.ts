import { Injectable, NotFoundException } from '@nestjs/common';
import { ForceSendMessageWebhookDto } from '../user.dto';
import { PrismaService } from 'src/services/prisma.service';
import { CallMessageWebhookService } from 'src/modules/email/services/call-message-webhook.service';

@Injectable()
export class ForceSendMessageWebhookService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly callMessageWebhookService: CallMessageWebhookService,
  ) {}

  async execute(id: string, data: ForceSendMessageWebhookDto, userId: string) {
    const message = await this.prisma.message.findFirst({
      where: { id, userId },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    await this.callMessageWebhookService.execute(message.id, data.status);
  }
}
