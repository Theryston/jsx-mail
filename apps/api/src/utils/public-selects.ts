import { Prisma } from '@prisma/client';

export const fileSelect: Prisma.FileSelect = {
  id: true,
  encoding: true,
  mimeType: true,
  originalName: true,
  size: true,
  url: true,
  key: true,
  hash: true,
};

export const domainSelect: Prisma.DomainSelect = {
  id: true,
  name: true,
  userId: true,
  status: true,
  createdAt: true,
  dnsRecords: {
    select: {
      id: true,
      name: true,
      value: true,
      type: true,
      ttl: true,
    },
  },
};

export const senderSelect: Prisma.SenderSelect = {
  id: true,
  username: true,
  name: true,
  email: true,
  domainId: true,
  userId: true,
  createdAt: true,
};

export const messageSelect: Prisma.MessageSelect = {
  id: true,
  subject: true,
  senderId: true,
  status: true,
  userId: true,
  to: true,
  sentAt: true,
};

export const sessionSelect: Prisma.SessionSelect = {
  id: true,
  createdAt: true,
  description: true,
  expiresAt: true,
  permissions: true,
};

export const transactionSelect: Prisma.TransactionSelect = {
  id: true,
  amount: true,
  description: true,
  createdAt: true,
};
