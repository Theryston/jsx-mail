import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { friendlyMoney } from 'src/utils/format-money';
import { GetSettingsService } from './get-settings.service';

@Injectable()
export class GetBalanceService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string) {
    const result = await this.prisma.transaction.aggregate({
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
