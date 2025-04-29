import { Inject, Injectable } from '@nestjs/common';
import moment from 'moment';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class UpdateChargeMonthService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute() {
    console.log(`[UPDATE_CHARGE_MONTH] started at: ${new Date()}`);

    const currentChargeMonth = moment().format('YYYY-MM');

    const pendingMessages = await this.prisma.client.message.findMany({
      where: {
        deletedAt: null,
        hasCharged: false,
        chargeMonth: {
          lt: currentChargeMonth,
        },
      },
    });

    for (const message of pendingMessages) {
      await this.prisma.client.message.update({
        where: {
          id: message.id,
        },
        data: {
          chargeMonth: currentChargeMonth,
        },
      });

      console.log(
        `[UPDATE_CHARGE_MONTH] updated message ${message.id} to charge month ${currentChargeMonth}`,
      );
    }

    console.log(`[UPDATE_CHARGE_MONTH] ended at: ${new Date()}`);

    return {
      message: `Updated ${pendingMessages.length} messages to charge month ${currentChargeMonth}`,
    };
  }
}
