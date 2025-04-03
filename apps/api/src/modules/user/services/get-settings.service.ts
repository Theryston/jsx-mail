import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { MONEY_SCALE } from 'src/utils/constants';

@Injectable()
export class GetSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId?: string, defaultOnly = false) {
    let settings = await this.getDefaultSettings();

    if (userId && !defaultOnly) {
      const userSettings = await this.prisma.userSettings.findFirst({
        where: { userId },
      });

      settings = {
        ...settings,
        ...userSettings,
      };
    }

    return {
      maxFileSize: settings.maxFileSize * 1024 * 1024,
      maxBalanceToBeEligibleForFree:
        settings.maxBalanceToBeEligibleForFree * MONEY_SCALE,
      freeEmailsPerMonth: settings.freeEmailsPerMonth,
      minBalanceToAdd: settings.minBalanceToAdd * MONEY_SCALE,
      storageGbPrice: settings.storageGbPrice * MONEY_SCALE,
      pricePerMessage: settings.pricePerMessage * MONEY_SCALE,
      maxStorage: settings.maxStorage * 1024 * 1024 * 1024,
      globalMaxMessagesPerSecond: settings.globalMaxMessagesPerSecond,
      globalMaxMessagesPerDay: settings.globalMaxMessagesPerDay,
      bounceRateLimit: settings.bounceRateLimit,
      complaintRateLimit: settings.complaintRateLimit,
      gapToCheckSecurityInsights: settings.gapToCheckSecurityInsights,
      minEmailsForRateCalculation: settings.minEmailsForRateCalculation,
      maxSecurityCodesPerHour: settings.maxSecurityCodesPerHour,
      maxSecurityCodesPerMinute: settings.maxSecurityCodesPerMinute,
    };
  }

  async getDefaultSettings() {
    const defaultSettings = await this.prisma.defaultSettings.findFirst();

    return {
      maxFileSize: defaultSettings?.maxFileSize || 10,
      maxBalanceToBeEligibleForFree:
        defaultSettings?.maxBalanceToBeEligibleForFree || 0.05,
      freeEmailsPerMonth: defaultSettings?.freeEmailsPerMonth || 10000,
      minBalanceToAdd: defaultSettings?.minBalanceToAdd || 1,
      storageGbPrice: defaultSettings?.storageGbPrice || 0.025,
      pricePerMessage: defaultSettings?.pricePerMessage || 0.0002,
      maxStorage: defaultSettings?.maxStorage || 5,
      globalMaxMessagesPerSecond:
        defaultSettings?.globalMaxMessagesPerSecond || 14,
      globalMaxMessagesPerDay:
        defaultSettings?.globalMaxMessagesPerDay || 100000,
      bounceRateLimit: defaultSettings?.bounceRateLimit || 0.05,
      complaintRateLimit: defaultSettings?.complaintRateLimit || 0.01,
      gapToCheckSecurityInsights:
        defaultSettings?.gapToCheckSecurityInsights || 5,
      minEmailsForRateCalculation:
        defaultSettings?.minEmailsForRateCalculation || 10,
      maxSecurityCodesPerHour: defaultSettings?.maxSecurityCodesPerHour || 10,
      maxSecurityCodesPerMinute:
        defaultSettings?.maxSecurityCodesPerMinute || 1,
    };
  }
}
