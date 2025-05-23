import { Inject, Injectable } from '@nestjs/common';
import { MONEY_SCALE } from 'src/utils/constants';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

type GetSettingsOptions = {
  defaultOnly?: boolean;
  noScale?: boolean;
};

export type Settings = {
  maxFileSize: number;
  maxBalanceToBeEligibleForFree: number;
  freeEmailsPerMonth: number;
  minBalanceToAdd: number;
  storageGbPrice: number;
  pricePerMessage: number;
  maxStorage: number;
  globalMaxMessagesPerSecond: number;
  globalMaxMessagesPerDay: number;
  bounceRateLimit: number;
  complaintRateLimit: number;
  gapToCheckSecurityInsights: number;
  minEmailsForRateCalculation: number;
  maxSecurityCodesPerHour: number;
  maxSecurityCodesPerMinute: number;
  globalEmailsCheckPerSecond: number;
  globalBulkEmailCheckMaxBatchSize: number;
  pricePerEmailCheck: number;
};

@Injectable()
export class GetSettingsService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute(
    userId?: string,
    options?: GetSettingsOptions,
  ): Promise<Settings> {
    let settings = await this.getDefaultSettings();

    if (userId && !options?.defaultOnly) {
      const userSettings = await this.getUserSettings(userId);

      for (const key in settings) {
        if (
          userSettings?.[key] !== undefined &&
          userSettings[key] !== null &&
          userSettings[key] !== settings[key]
        ) {
          settings[key] = userSettings[key];
        }
      }
    }

    return {
      maxFileSize: options?.noScale
        ? settings.maxFileSize
        : settings.maxFileSize * 1024 * 1024,
      maxBalanceToBeEligibleForFree: options?.noScale
        ? settings.maxBalanceToBeEligibleForFree
        : settings.maxBalanceToBeEligibleForFree * MONEY_SCALE,
      freeEmailsPerMonth: settings.freeEmailsPerMonth,
      minBalanceToAdd: options?.noScale
        ? settings.minBalanceToAdd
        : settings.minBalanceToAdd * MONEY_SCALE,
      storageGbPrice: options?.noScale
        ? settings.storageGbPrice
        : settings.storageGbPrice * MONEY_SCALE,
      pricePerMessage: options?.noScale
        ? settings.pricePerMessage
        : settings.pricePerMessage * MONEY_SCALE,
      maxStorage: options?.noScale
        ? settings.maxStorage
        : settings.maxStorage * 1024 * 1024 * 1024,
      globalMaxMessagesPerSecond: settings.globalMaxMessagesPerSecond,
      globalMaxMessagesPerDay: settings.globalMaxMessagesPerDay,
      bounceRateLimit: settings.bounceRateLimit,
      complaintRateLimit: settings.complaintRateLimit,
      gapToCheckSecurityInsights: settings.gapToCheckSecurityInsights,
      minEmailsForRateCalculation: settings.minEmailsForRateCalculation,
      maxSecurityCodesPerHour: settings.maxSecurityCodesPerHour,
      maxSecurityCodesPerMinute: settings.maxSecurityCodesPerMinute,
      globalEmailsCheckPerSecond: settings.globalEmailsCheckPerSecond,
      globalBulkEmailCheckMaxBatchSize:
        settings.globalBulkEmailCheckMaxBatchSize,
      pricePerEmailCheck: options?.noScale
        ? settings.pricePerEmailCheck
        : settings.pricePerEmailCheck * MONEY_SCALE,
    };
  }

  async getUserSettings(userId: string) {
    const userSettings = await this.prisma.client.userSettings.findFirst({
      where: { userId },
    });

    return userSettings;
  }

  async getDefaultSettings() {
    const defaultSettings =
      await this.prisma.client.defaultSettings.findFirst();

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
        defaultSettings?.globalMaxMessagesPerSecond || 50,
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
      pricePerEmailCheck: defaultSettings?.pricePerEmailCheck || 0.0001,
      globalEmailsCheckPerSecond:
        defaultSettings?.globalEmailsCheckPerSecond || 1,
      globalBulkEmailCheckMaxBatchSize:
        defaultSettings?.globalBulkEmailCheckMaxBatchSize || 1000,
    };
  }
}
