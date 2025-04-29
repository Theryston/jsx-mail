import { Inject, Injectable } from '@nestjs/common';
import { TransactionStyle } from '@prisma/client';
import { formatSize } from 'src/utils/format';
import { storageToMoney } from 'src/utils/format-money';
import moment from 'moment';
import { GetUserLimitsService } from 'src/modules/user/services/get-user-limits.service';
import { GetSettingsService } from 'src/modules/user/services/get-settings.service';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class ChargeService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
    private readonly getUserLimitsService: GetUserLimitsService,
    private readonly getSettingsService: GetSettingsService,
  ) {}

  async execute() {
    console.log(`[CHARGE] started at: ${new Date()}`);
    const results = await Promise.all([
      this.chargeMessage(),
      // do not charge storage for now
      // this.chargeStorage()
    ]);
    console.log(`[CHARGE] ended at: ${new Date()}`);

    return results;
  }

  async chargeMessage() {
    const currentChargeMonth = moment().format('YYYY-MM');

    const currentMonthMessages = await this.prisma.client.message.groupBy({
      where: {
        hasCharged: false,
        chargeMonth: currentChargeMonth,
        deletedAt: null,
      },
      by: ['userId'],
      _count: {
        id: true,
      },
    });

    const usersCharged = [];

    for (const {
      userId,
      _count: { id: notChargedMessagesAmount },
    } of currentMonthMessages) {
      const settings = await this.getSettingsService.execute(userId);

      try {
        const currentMonthMessagesAmount =
          await this.prisma.client.message.count({
            where: {
              userId,
              chargeMonth: currentChargeMonth,
              deletedAt: null,
            },
          });

        const { isEligibleForFree } =
          await this.getUserLimitsService.execute(userId);

        let price = 0;
        let description = '';
        let chargedMessages = notChargedMessagesAmount;
        let restFreeMessages = 0;

        if (!isEligibleForFree) {
          // If user is not eligible for free messages, charge for all messages
          price = notChargedMessagesAmount * settings.pricePerMessage;
          description = `Charge for ${notChargedMessagesAmount} messages`;
        } else if (currentMonthMessagesAmount > settings.freeEmailsPerMonth) {
          // Calculate the remaining free messages for the user in the current month
          restFreeMessages =
            settings.freeEmailsPerMonth -
            (currentMonthMessagesAmount - notChargedMessagesAmount);

          if (restFreeMessages < 0) restFreeMessages = 0;

          // Calculate the number of messages to be charged
          chargedMessages = notChargedMessagesAmount - restFreeMessages;

          // If the number of charged messages is negative, set it to 0
          if (chargedMessages < 0) chargedMessages = 0;

          // Calculate the price based on the number of charged messages
          price = chargedMessages * settings.pricePerMessage;

          // Set the description for the charge
          description = `Charge for ${chargedMessages} messages${restFreeMessages !== 0 ? ` and ignored ${restFreeMessages} free messages` : ''}`;
        } else {
          description = `Ignored charge of ${notChargedMessagesAmount} message because the free messages limit was not reached`;
        }

        await this.removeBalance({
          amount: price,
          style: 'message_charge',
          userId,
          description,
        });

        await this.prisma.client.message.updateMany({
          where: {
            userId,
            hasCharged: false,
            chargeMonth: currentChargeMonth,
            deletedAt: null,
          },
          data: {
            hasCharged: true,
          },
        });

        usersCharged.push({
          userId,
          messagesAmount: notChargedMessagesAmount,
          chargedMessages,
          restFreeMessages,
          price,
          isEligibleForFree,
        });

        console.log(`[CHARGE_MESSAGE] ${userId} - ${price}`);
      } catch (error) {
        console.log(`[CHARGE_MESSAGE] ${JSON.stringify(error)}`);
      }
    }

    console.log(`[CHARGE_MESSAGE] ended at: ${new Date()}`);

    return {
      message: 'Worker CHARGE_MESSAGE finished!',
      result: usersCharged,
    };
  }

  async chargeStorage() {
    const today = moment().set({
      hour: 0,
      minute: 0,
      second: 0,
      milliseconds: 0,
    });

    const storageSize = await this.prisma.client.storageSize.groupBy({
      where: {
        deletedAt: null,
        chargedAt: null,
        chargeAt: {
          gte: today.toDate(),
        },
      },
      by: ['userId'],
      _sum: {
        size: true,
      },
    });

    const usersCharged = [];

    for (const {
      userId,
      _sum: { size },
    } of storageSize) {
      const firstDayOfMonth = moment().startOf('month').set({
        hour: 0,
        minute: 0,
        second: 0,
        milliseconds: 0,
      });
      const days = moment().diff(firstDayOfMonth, 'days') + 1;
      const averageSize = Math.round(size / days);
      const settings = await this.getSettingsService.execute(userId);

      const price = storageToMoney(averageSize, settings.storageGbPrice);

      await this.removeBalance({
        amount: price,
        style: 'storage_charge',
        userId,
        description: `Charge for an average of ${formatSize(averageSize)} stored`,
      });

      await this.prisma.client.storageSize.updateMany({
        where: {
          userId,
          deletedAt: null,
          chargedAt: null,
          chargeAt: {
            gte: today.toDate(),
          },
        },
        data: {
          chargedAt: new Date(),
        },
      });

      usersCharged.push({
        userId,
        averageSize,
        price,
      });

      console.log(`[CHARGE_STORAGE] ${userId} - ${price}`);
    }

    console.log(`[CHARGE_STORAGE] ended at: ${new Date()}`);

    return {
      message: 'Worker CHARGE_STORAGE finished!',
      result: usersCharged,
    };
  }

  async removeBalance({
    amount,
    userId,
    style,
    description,
  }: {
    amount: number;
    userId: string;
    style: TransactionStyle;
    description: string;
  }) {
    const negativeAmount = Math.round(amount) * -1;
    await this.prisma.client.transaction.create({
      data: {
        amount: negativeAmount,
        style,
        userId,
        description,
      },
    });
  }
}
