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
  blockedPermissions: string[];
  onboardingStep:
    | 'create_domain'
    | 'verify_domain'
    | 'create_sender'
    | 'send_test_email'
    | 'completed';
  accessLevel: 'self' | 'other';
  phone?: string | null;
  isPhoneVerified: boolean;
  birthdate?: Date | null;
  balance: Balance;
  session: Session | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Session = {
  id: string;
  createdAt: string;
  description: string;
  expiresAt: string | null;
  permissions: string[];
  impersonateUserId: string | null;
};

export type MessagesSentByDay = {
  sentDay: string;
  count: number;
};

export type InsightData = {
  title: string;
  value: string;
  description: string;
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

export type Transaction = {
  id: string;
  amount: number;
  friendlyAmount: string;
  description: string;
  createdAt: string;
};

export type Pagination = {
  totalPages: number;
};

export type TransactionsPagination = Pagination & {
  transactions: Transaction[];
};

export type Permission = {
  title: string;
  value: string;
  description: string;
};

export type UserUtm = {
  utmName: string;
  utmValue: string;
};

export type UserAdmin = User & {
  userUtm: UserUtm[];
  isUserPriority: {
    id: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
  }[];
  userUtmGroups?: {
    id: string;
    views?: {
      id: string;
      url: string;
    }[];
  }[];
};

export type AdminUsersPagination = {
  users: UserAdmin[];
  totalPages: number;
  total: number;
  hasNext: boolean;
};

export type UserWebhook = {
  id: string;
  url: string;
  messageStatuses: string[];
  createdAt: string;
  updatedAt: string;
};

export type Export = {
  id: string;
  exportStatus: 'pending' | 'processing' | 'completed' | 'failed';
  format: 'csv' | 'json';
  startDate: string;
  endDate: string;
  statuses: string[];
  errorMessage?: string;
  file?: {
    url: string;
    size: number;
    type: string;
  };
  createdAt: string;
  updatedAt: string;
};
