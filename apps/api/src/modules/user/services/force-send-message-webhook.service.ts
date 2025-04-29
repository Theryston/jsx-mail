import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ForceSendMessageWebhookDto } from '../user.dto';
import { CallMessageWebhookService } from 'src/modules/email/services/call-message-webhook.service';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class ForceSendMessageWebhookService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
    private readonly callMessageWebhookService: CallMessageWebhookService,
  ) {}

  async execute(id: string, data: ForceSendMessageWebhookDto, userId: string) {
    const message = await this.prisma.client.message.findFirst({
      where: { id, userId },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    await this.callMessageWebhookService.execute(message.id, data.status);
  }
}
