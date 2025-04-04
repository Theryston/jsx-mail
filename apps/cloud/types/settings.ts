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
};

export type UserSettings = Omit<
  Settings,
  'globalMaxMessagesPerSecond' | 'globalMaxMessagesPerDay'
>;
