import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class DeleteSenderService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string, userId: string) {
    const sender = await this.prisma.sender.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });

    if (!sender) {
      throw new HttpException('Sender not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.sender.update({
      where: {
        id: sender.id,
      },
      data: {
        email: `${sender.email}-${sender.id}`,
      },
    });

    await this.prisma.sender.delete({
      where: {
        id: sender.id,
      },
    });

    return {
      message: 'Sender deleted',
    };
  }
}
