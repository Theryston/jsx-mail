import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { PrismaService } from 'src/services/prisma.service';
import { FREE_EMAILS_PER_MONTH, PRICE_PER_MESSAGE } from 'src/utils/constants';
import { GetBalanceService } from './get-balance.service';

@Injectable()
export class GetAvailableUserFreeLimitService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly getBalanceService: GetBalanceService,
  ) {}

  async execute(userId: string) {
    const messagesCount = await this.prisma.message.count({
      where: {
        userId,
        deletedAt: null,
        createdAt: {
          gte: moment().startOf('month').toDate(),
        },
      },
    });

    const balance = await this.getBalanceService.execute(userId);
    const availableFreeMessages = FREE_EMAILS_PER_MONTH - messagesCount;
    const availableMessagesByBalance = Math.floor(
      balance.amount / PRICE_PER_MESSAGE,
    );

    const availableMessages =
      availableFreeMessages + availableMessagesByBalance;

    return {
      availableFreeMessages,
      availableMessagesByBalance,
      balance: balance.amount,
      availableMessages,
    };
  }
}
