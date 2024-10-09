import { Prisma } from '@prisma/client';
import { MONEY_SCALE } from '../../src/utils/constants';

const user: Prisma.UserCreateInput = {
  email: 'jsxmailorg@gmail.com',
  name: 'jsx mail',
  password: process.env.HASHED_ADMIN_PASSWORD as string,
  isEmailVerified: true,
  accessLevel: 'other',
};

const domain: Prisma.DomainCreateInput = {
  name: 'jsxmail.org',
  status: 'verified',
  user: {
    connect: {
      email: 'jsxmailorg@gmail.com',
    },
  },
};

const transaction: Prisma.TransactionCreateInput = {
  id: '3450254d-5f48-40af-918b-5c6a26baa4ca',
  amount: 100 * MONEY_SCALE,
  description: 'Initial balance for admin',
  style: 'earn_free',
  user: {
    connect: {
      email: 'jsxmailorg@gmail.com',
    },
  },
};

const data = [
  {
    modelName: 'user',
    data: user,
    uniqueField: 'email',
  },
  {
    modelName: 'domain',
    data: domain,
    uniqueField: 'name',
  },
  {
    modelName: 'transaction',
    data: transaction,
    uniqueField: 'id',
  },
];

export default data;
