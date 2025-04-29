import { Injectable } from '@nestjs/common';
import { CreateUserWebhookDto } from '../user.dto';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import { Inject } from '@nestjs/common';

@Injectable()
export class CreateUserWebhookService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute(data: CreateUserWebhookDto, userId: string) {
    const userWebhook = await this.prisma.client.userWebhook.create({
      data: {
        url: data.url,
        messageStatuses: data.status,
        userId,
      },
    });

    return userWebhook;
  }
}
