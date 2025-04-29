import { Inject, Injectable } from '@nestjs/common';
import { friendlyMoney } from 'src/utils/format-money';
import { transactionSelect } from 'src/utils/public-selects';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

type ListTransactionsData = {
  take: number;
  page: number;
};

@Injectable()
export class ListTransactionsService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute({ take, page }: ListTransactionsData, userId: string) {
    if (take > 100) take = 100;
    const skip = take * (page - 1);

    let transactions = await this.prisma.client.transaction.findMany({
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

    const count = await this.prisma.client.transaction.count({
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
