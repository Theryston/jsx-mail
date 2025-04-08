import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { EstimatedBulkEmailCheckDto } from '../bulk-sending.dto';
import { GetSettingsService } from 'src/modules/user/services/get-settings.service';
import { friendlyMoney, friendlyTime } from 'src/utils/format-money';
import moment from 'moment';

@Injectable()
export class EstimatedBulkEmailCheckService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly getSettingsService: GetSettingsService,
  ) {}

  async execute(
    { contactGroupId }: EstimatedBulkEmailCheckDto,
    userId: string,
    customEmailsTotal?: number,
  ) {
    const settings = await this.getSettingsService.execute(userId);

    const currentProcessingBulkEmailChecks =
      await this.prisma.bulkEmailCheck.findFirst({
        where: {
          status: {
            in: ['pending', 'processing'],
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

    if (!customEmailsTotal) {
      const contactGroup = await this.prisma.contactGroup.findUnique({
        where: { id: contactGroupId, userId },
      });

      if (!contactGroup) {
        throw new NotFoundException('Contact group not found');
      }

      const contactsCount = await this.prisma.contact.count({
        where: { contactGroupId, bouncedAt: null },
      });

      customEmailsTotal = contactsCount;
    }

    if (customEmailsTotal === 1) customEmailsTotal = 2;

    const estimatedCost = customEmailsTotal * settings.pricePerEmailCheck;
    const estimatedTimeSeconds =
      customEmailsTotal * settings.globalEmailsCheckPerSecond;

    const startFromMoment = currentProcessingBulkEmailChecks
      ? moment(currentProcessingBulkEmailChecks.estimatedEndAt)
      : moment();

    const estimatedEndAt = startFromMoment
      .add(estimatedTimeSeconds, 'seconds')
      .toDate();

    return {
      estimatedCost,
      friendlyEstimatedCost: friendlyMoney(estimatedCost, true),
      estimatedTimeSeconds,
      friendlyEstimatedTime: friendlyTime(estimatedTimeSeconds),
      contactsCount: customEmailsTotal,
      estimatedEndAt,
    };
  }
}
