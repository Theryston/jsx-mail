export type Balance = {
  amount: number;
  friendlyFullAmount: string;
  friendlyAmount: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  accessLevel: string;
  phone: string | null;
  isPhoneVerified: boolean;
  birthdate: Date | null;
  balance: Balance;
  createdAt: Date;
  updatedAt: Date;
};

export type Session = {
  id: string;
  createdAt: string;
  description: string;
  expiresAt: string | null;
  permissions: string[];
};

export type MessagesSentByDay = {
  sentDay: string;
  count: number;
};

export type InsightData = {
  title: string;
  value: string;
};

export type Insight = {
  MESSAGES_SENT_BY_DAY: MessagesSentByDay[];
  DATA: InsightData[];
};

export type FullBalance = {
  CURRENT: Balance;
  MONTH_ADDED: Balance;
  MONTH_CHARGED: Balance;
};
