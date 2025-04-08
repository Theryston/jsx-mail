import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { GetBalanceService } from './get-balance.service';
import moment from 'moment';
import { friendlyMoney } from 'src/utils/format-money';

@Injectable()
export class GetFullBalanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly getBalanceService: GetBalanceService,
  ) {}

  async execute(userId: string) {
    const currentBalance = await this.getBalanceService.execute(userId);

    const firstDayOfMonth = moment().startOf('month').set({
      hour: 0,
      minute: 0,
      second: 0,
      milliseconds: 0,
    });

    const {
      _sum: { amount: currentMonthAddedBalance },
    } = await this.prisma.transaction.aggregate({
      where: {
        userId,
        deletedAt: null,
        amount: {
          gt: 0,
        },
        createdAt: {
          gte: firstDayOfMonth.toDate(),
        },
      },
      _sum: {
        amount: true,
      },
    });

    const {
      _sum: { amount: currentMonthChargedBalance },
    } = await this.prisma.transaction.aggregate({
      where: {
        userId,
        deletedAt: null,
        amount: {
          lt: 0,
        },
        createdAt: {
          gte: firstDayOfMonth.toDate(),
        },
      },
      _sum: {
        amount: true,
      },
    });

    const addedBalance = currentMonthAddedBalance || 0;
    const chargedBalance = (currentMonthChargedBalance || 0) * -1;

    return {
      CURRENT: currentBalance,
      MONTH_ADDED: {
        amount: addedBalance,
        friendlyFullAmount: friendlyMoney(addedBalance, true),
        friendlyAmount: friendlyMoney(addedBalance, false),
      },
      MONTH_CHARGED: {
        amount: chargedBalance,
        friendlyFullAmount: friendlyMoney(chargedBalance, true),
        friendlyAmount: friendlyMoney(chargedBalance, false),
      },
    };
  }
}
