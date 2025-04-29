import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class ListUserWebhookService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute(userId: string) {
    const userWebhooks = await this.prisma.client.userWebhook.findMany({
      where: { userId },
    });

    return userWebhooks;
  }
}
