import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { CreateUserWebhookDto } from '../user.dto';

@Injectable()
export class CreateUserWebhookService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(data: CreateUserWebhookDto, userId: string) {
    const userWebhook = await this.prisma.userWebhook.create({
      data: {
        url: data.url,
        messageStatuses: data.status,
        userId,
      },
    });

    return userWebhook;
  }
}
