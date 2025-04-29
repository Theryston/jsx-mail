import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class DeleteSenderService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute(id: string, userId: string) {
    const sender = await this.prisma.client.sender.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });

    if (!sender) {
      throw new HttpException('Sender not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.client.sender.update({
      where: {
        id: sender.id,
      },
      data: {
        email: `${sender.email}-${sender.id}`,
      },
    });

    await this.prisma.client.sender.delete({
      where: {
        id: sender.id,
      },
    });

    return {
      message: 'Sender deleted',
    };
  }
}
