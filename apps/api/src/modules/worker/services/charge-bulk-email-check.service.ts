import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { GetSettingsService } from 'src/modules/user/services/get-settings.service';
import { ChargeService } from './charge.service';
import { TransactionStyle } from '@prisma/client';
import { Prisma } from '@prisma/client';

@Injectable()
export class ChargeBulkEmailCheckService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly getSettingsService: GetSettingsService,
    private readonly chargeService: ChargeService,
  ) {}

  async execute({
    userId,
    bulkEmailCheckId,
  }: {
    userId: string;
    bulkEmailCheckId: string;
  }) {
    console.log(`[CHARGE_BULK_EMAIL_CHECK] started for ${userId}`);

    const where: Prisma.EmailCheckWhereInput = {
      bulkEmailCheckId,
      chargedAt: null,
      deletedAt: null,
      status: {
        notIn: ['pending', 'processing'],
      },
      userId,
    };

    const totalCount = await this.prisma.emailCheck.count({
      where,
    });

    console.log(
      `[CHARGE_BULK_EMAIL_CHECK] ${userId} has ${totalCount} email checks to charge`,
    );

    if (totalCount === 0) {
      console.log(
        `[CHARGE_BULK_EMAIL_CHECK] ${userId} has no email checks to charge`,
      );
      return;
    }

    const settings = await this.getSettingsService.execute(userId);
    const totalAmount = totalCount * settings.pricePerEmailCheck;

    await this.chargeService.removeBalance({
      amount: totalAmount,
      userId,
      style: TransactionStyle.email_check_charge,
      description: `Charge for ${totalCount} email checks`,
    });

    await this.prisma.emailCheck.updateMany({
      where,
      data: {
        chargedAt: new Date(),
      },
    });

    console.log(
      `[CHARGE_BULK_EMAIL_CHECK] ${userId} finished charging ${totalCount} email checks for ${totalAmount}`,
    );
  }
}
