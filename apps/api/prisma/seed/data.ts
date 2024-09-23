import { Prisma } from '@prisma/client';

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
];

export default data;
