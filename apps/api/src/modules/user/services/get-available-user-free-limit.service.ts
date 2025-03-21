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

    const notChargedMessages = await this.prisma.message.count({
      where: {
        userId,
        deletedAt: null,
        createdAt: {
          gte: moment().startOf('month').toDate(),
        },
        hasCharged: false,
        sentAt: {
          not: null,
        },
      },
    });

    const balance = await this.getBalanceService.execute(userId);

    let missingChargeMessages = notChargedMessages - FREE_EMAILS_PER_MONTH;
    if (missingChargeMessages < 0) missingChargeMessages = 0;

    const projectedBalance =
      balance.amount - missingChargeMessages * PRICE_PER_MESSAGE;

    let availableFreeMessages = FREE_EMAILS_PER_MONTH - messagesCount;
    if (availableFreeMessages < 0) availableFreeMessages = 0;

    let availableMessagesByBalance = Math.floor(
      projectedBalance / PRICE_PER_MESSAGE,
    );
    if (availableMessagesByBalance < 0) availableMessagesByBalance = 0;

    let availableMessages = availableFreeMessages + availableMessagesByBalance;
    if (availableMessages < 0) availableMessages = 0;

    return {
      availableFreeMessages,
      availableMessagesByBalance,
      balance: balance.amount,
      availableMessages,
    };
  }
}
