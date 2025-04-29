import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class DeleteUserWebhookService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute(id: string, userId: string) {
    const userWebhook = await this.prisma.client.userWebhook.findFirst({
      where: { id, userId },
    });

    if (!userWebhook) throw new NotFoundException('User webhook not found');

    await this.prisma.client.userWebhook.delete({
      where: { id, userId },
    });

    return { message: 'User webhook deleted successfully' };
  }
}
