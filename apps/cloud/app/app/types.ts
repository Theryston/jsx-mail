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

export type Pagination = {
  totalPages: number;
};

export type Status = {
  value: string;
  label: string;
  description: string;
  color: string;
};
