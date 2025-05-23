import { Inject, Injectable } from '@nestjs/common';
import moment from 'moment';
import { GetBalanceService } from './get-balance.service';
import { GetSettingsService } from './get-settings.service';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class GetUserLimitsService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
    private readonly getBalanceService: GetBalanceService,
    private readonly getSettingsService: GetSettingsService,
  ) {}

  async execute(userId: string) {
    const balance = await this.getBalanceService.execute(userId);

    const settings = await this.getSettingsService.execute(userId);

    const messagesCount = await this.prisma.client.message.count({
      where: {
        userId,
        deletedAt: null,
        createdAt: {
          gte: moment().startOf('month').toDate(),
        },
        status: {
          notIn: ['bounce', 'failed', 'reject', 'complaint'],
        },
      },
    });

    const notChargedMessages = await this.prisma.client.message.count({
      where: {
        userId,
        deletedAt: null,
        hasCharged: false,
        sentAt: {
          not: null,
        },
      },
    });

    const isEligibleForFree =
      balance.amount <= settings.maxBalanceToBeEligibleForFree;

    let missingChargeMessages =
      notChargedMessages -
      (isEligibleForFree ? settings.freeEmailsPerMonth : 0);
    if (missingChargeMessages < 0) missingChargeMessages = 0;

    const projectedBalance =
      balance.amount - missingChargeMessages * settings.pricePerMessage;

    let availableFreeMessages = isEligibleForFree
      ? settings.freeEmailsPerMonth - messagesCount
      : 0;
    if (availableFreeMessages < 0) availableFreeMessages = 0;

    let availableMessagesByBalance = Math.floor(
      projectedBalance / settings.pricePerMessage,
    );
    if (availableMessagesByBalance < 0) availableMessagesByBalance = 0;

    let availableMessages = availableFreeMessages + availableMessagesByBalance;
    if (availableMessages < 0) availableMessages = 0;

    return {
      availableFreeMessages,
      availableMessagesByBalance,
      balance: balance.amount,
      availableMessages,
      projectedBalance,
      isEligibleForFree,
    };
  }
}
