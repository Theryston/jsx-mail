import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { CreateBulkEmailCheckDto } from '../bulk-sending.dto';
import { GetSettingsService } from 'src/modules/user/services/get-settings.service';
import { friendlyMoney, friendlyTime } from 'src/utils/format-money';

@Injectable()
export class EstimatedBulkEmailCheckService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly getSettingsService: GetSettingsService,
  ) {}

  async execute({ contactGroupId }: CreateBulkEmailCheckDto, userId: string) {
    const settings = await this.getSettingsService.execute(userId);

    const contactGroup = await this.prisma.contactGroup.findUnique({
      where: { id: contactGroupId, userId },
    });

    if (!contactGroup) {
      throw new NotFoundException('Contact group not found');
    }

    const contactsCount = await this.prisma.contact.count({
      where: { contactGroupId, bouncedAt: null },
    });

    const estimatedCost = contactsCount * settings.pricePerEmailCheck;
    const estimatedTimeSeconds =
      contactsCount * settings.globalEmailsCheckPerSecond;

    return {
      estimatedCost,
      friendlyEstimatedCost: friendlyMoney(estimatedCost, true),
      estimatedTimeSeconds,
      friendlyEstimatedTime: friendlyTime(estimatedTimeSeconds),
      contactsCount,
    };
  }
}
