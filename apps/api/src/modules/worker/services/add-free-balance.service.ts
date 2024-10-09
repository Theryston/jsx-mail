import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { PrismaService } from 'src/services/prisma.service';
import { FREE_BALANCE } from 'src/utils/constants';

@Injectable()
export class AddFreeBalanceService {
  constructor(private readonly prisma: PrismaService) {}

  async execute() {
    console.log('[ADD_FREE_BALANCE] started at: ', new Date());

    const oneMonthAgo = moment()
      .subtract(1, 'month')
      .add(1, 'day')
      .set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      })
      .toDate();

    const usersToAddBalance = await this.prisma.user.findMany({
      where: {
        deletedAt: null,
        isEmailVerified: true,
        transactions: {
          none: {
            createdAt: {
              gte: oneMonthAgo,
            },
            style: 'earn_free',
          },
        },
      },
    });

    const balancesAdded = [];

    for (const user of usersToAddBalance) {
      const {
        _sum: { amount: balance },
      } = await this.prisma.transaction.aggregate({
        where: {
          userId: user.id,
          deletedAt: null,
        },
        _sum: {
          amount: true,
        },
      });

      let diff = balance < 0 ? 0 : FREE_BALANCE - balance;
      if (diff < 0) diff = 0;

      await this.prisma.transaction.create({
        data: {
          amount: diff,
          style: 'earn_free',
          userId: user.id,
          description: 'Earning from free balance',
        },
      });

      balancesAdded.push({
        userId: user.id,
        amount: diff,
      });

      console.log(`[ADD_FREE_BALANCE] ${user.id} added ${diff} free balance`);
    }

    console.log('[ADD_FREE_BALANCE] ended at: ', new Date());

    return {
      message: 'Worker ADD_FREE_BALANCE finished!',
      result: balancesAdded,
    };
  }
}
