import { PrismaClient } from '@prisma/client';
import moment from 'moment';

const prisma = new PrismaClient();

export const handler = async () => {
  console.log(`[STORAGE-SIZE] started at: ${new Date()}`);
  const filesUsers = await prisma.file.groupBy({
    where: {
      deletedAt: {
        isSet: false,
      },
    },
    by: ['userId'],
    _sum: {
      size: true,
    },
  });

  for (const {
    userId,
    _sum: { size },
  } of filesUsers) {
    const today = moment().set({
      hour: 0,
      minute: 0,
      second: 0,
      milliseconds: 0,
    });

    const hasStorage = await prisma.storageSize.findFirst({
      where: {
        userId,
        createdAt: {
          gt: today.toDate(),
        },
      },
    });

    if (hasStorage) {
      console.log(`[STORAGE-SIZE] ${userId} - ${size} - skip`);
      continue;
    }

    const lastMonthDay = moment().endOf('month').set({
      hour: 0,
      minute: 0,
      second: 0,
      milliseconds: 0,
    });

    await prisma.storageSize.create({
      data: {
        userId,
        size,
        chargeAt: lastMonthDay.toDate(),
      },
    });

    console.log(`[STORAGE-SIZE] ${userId} - ${size}`);
  }

  await prisma.$disconnect();
  console.log(`[STORAGE-SIZE] ended at: ${new Date()}`);
};
