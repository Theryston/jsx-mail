import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
@Injectable()
export class DeleteUserWebhookService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string, userId: string) {
    const userWebhook = await this.prisma.userWebhook.findFirst({
      where: { id, userId },
    });

    if (!userWebhook) {
      throw new NotFoundException('User webhook not found');
    }

    await this.prisma.userWebhook.delete({
      where: { id, userId },
    });

    return { message: 'User webhook deleted successfully' };
  }
}
