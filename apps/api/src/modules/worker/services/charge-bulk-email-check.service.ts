import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { GetSettingsService } from 'src/modules/user/services/get-settings.service';
import { ChargeService } from './charge.service';
import { TransactionStyle } from '@prisma/client';

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

    let totalEmailChecks = 0;
    let processedCount = 0;
    const pageSize = 100;
    let hasMoreRecords = true;

    const totalCount = await this.prisma.emailCheck.count({
      where: {
        bulkEmailCheckId,
        chargedAt: null,
        deletedAt: null,
        status: {
          notIn: ['pending', 'processing'],
        },
        userId,
      },
    });

    console.log(
      `[CHARGE_BULK_EMAIL_CHECK] ${userId} has ${totalCount} email checks to charge`,
    );

    if (totalCount === 0) {
      return;
    }

    const settings = await this.getSettingsService.execute(userId);

    let totalAmount = 0;

    while (hasMoreRecords) {
      const emailChecks = await this.prisma.emailCheck.findMany({
        where: {
          chargedAt: null,
          deletedAt: null,
          status: {
            notIn: ['pending', 'processing', 'failed'],
          },
          userId,
          bulkEmailCheckId,
        },
        select: {
          id: true,
        },
        take: pageSize,
        skip: processedCount,
      });

      if (emailChecks.length === 0) {
        hasMoreRecords = false;
        break;
      }

      totalEmailChecks += emailChecks.length;
      processedCount += emailChecks.length;

      const batchAmount = emailChecks.length * settings.pricePerEmailCheck;
      totalAmount += batchAmount;

      await this.prisma.emailCheck.updateMany({
        where: {
          id: {
            in: emailChecks.map((emailCheck) => emailCheck.id),
          },
        },
        data: {
          chargedAt: new Date(),
        },
      });

      console.log(
        `[CHARGE_BULK_EMAIL_CHECK] ${userId} processed batch of ${emailChecks.length} (${processedCount}/${totalCount})`,
      );

      if (emailChecks.length < pageSize) {
        hasMoreRecords = false;
      }
    }

    await this.chargeService.removeBalance({
      amount: totalAmount,
      userId,
      style: TransactionStyle.email_check_charge,
      description: `Charge for ${totalEmailChecks} email checks`,
    });

    console.log(
      `[CHARGE_BULK_EMAIL_CHECK] ${userId} finished charging ${totalEmailChecks} email checks for ${totalAmount}`,
    );
  }
}
