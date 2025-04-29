import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { senderSelect } from 'src/utils/public-selects';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class ListSendersService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute(userId: string) {
    return this.prisma.client.sender.findMany({
      where: {
        userId,
        deletedAt: null,
        domain: {
          deletedAt: null,
        },
      },
      select: senderSelect,
    });
  }
}
