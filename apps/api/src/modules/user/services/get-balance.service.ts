import { Injectable } from '@nestjs/common';
import { friendlyMoney } from 'src/utils/format-money';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import { Inject } from '@nestjs/common';

@Injectable()
export class GetBalanceService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute(userId: string) {
    const result = await this.prisma.client.transaction.aggregate({
      where: {
        userId,
        deletedAt: null,
      },
      _sum: {
        amount: true,
      },
    });

    const amount = result._sum.amount || 0;

    return {
      amount,
      friendlyFullAmount: friendlyMoney(amount, true),
      friendlyAmount: friendlyMoney(amount, false),
    };
  }
}
