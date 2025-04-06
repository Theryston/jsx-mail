import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { EstimatedBulkEmailCheckDto } from '../bulk-sending.dto';
import { GetSettingsService } from 'src/modules/user/services/get-settings.service';
import { friendlyMoney, friendlyTime } from 'src/utils/format-money';

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

    const estimatedCost = customEmailsTotal * settings.pricePerEmailCheck;
    const estimatedTimeSeconds =
      customEmailsTotal * settings.globalEmailsCheckPerSecond;

    return {
      estimatedCost,
      friendlyEstimatedCost: friendlyMoney(estimatedCost, true),
      estimatedTimeSeconds,
      friendlyEstimatedTime: friendlyTime(estimatedTimeSeconds),
      contactsCount: customEmailsTotal,
    };
  }
}
