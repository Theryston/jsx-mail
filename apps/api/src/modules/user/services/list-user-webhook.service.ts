import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class ListUserWebhookService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string) {
    const userWebhooks = await this.prisma.userWebhook.findMany({
      where: { userId },
    });

    return userWebhooks;
  }
}
