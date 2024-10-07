import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { friendlyMoney } from 'src/utils/format-money';
import { transactionSelect } from 'src/utils/public-selects';

type ListTransactionsData = {
  take: number;
  page: number;
};

@Injectable()
export class ListTransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ take, page }: ListTransactionsData, userId: string) {
    if (take > 100) take = 100;
    const skip = take * (page - 1);

    let transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      select: transactionSelect,
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });

    transactions = transactions.map((transaction) => ({
      ...transaction,
      friendlyAmount: friendlyMoney(transaction.amount, true),
    }));

    const count = await this.prisma.transaction.count({
      where: {
        userId,
        deletedAt: null,
      },
    });

    return {
      transactions,
      totalPages: Math.ceil(count / take),
      total: count,
      hasNext: skip + take < count,
    };
  }
}
