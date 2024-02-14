import { PrismaClient, TransactionStyle } from '@prisma/client';
import { PRICE_PER_MESSAGE } from 'src/utils/contants';
import { bandwidthToMoney, storageToMoney } from 'src/utils/format-money';
import moment from 'moment';
import { formatSize } from 'src/utils/format';

const prisma = new PrismaClient();

export const handler = async () => {
  console.log(`[CHARGE] started at: ${new Date()}`);
  await Promise.all([chargeMessage(), chargeBandwidth(), chargeStorage()]);
  await prisma.$disconnect();
  console.log(`[CHARGE] ended at: ${new Date()}`);
};

async function chargeMessage() {
  const messages = await prisma.message.groupBy({
    where: {
      hasCharged: false,
      sentAt: {
        isSet: true,
      },
      deletedAt: {
        isSet: false,
      },
    },
    by: ['userId'],
    _count: {
      id: true,
    },
  });

  for (const {
    userId,
    _count: { id: messagesAmount },
  } of messages) {
    try {
      const price = messagesAmount * PRICE_PER_MESSAGE;

      await removeBalance({
        amount: price,
        style: 'message_charge',
        userId,
        description: `Charge for ${messagesAmount} sent messages`,
      });

      await prisma.message.updateMany({
        where: {
          userId,
          hasCharged: false,
          sentAt: {
            isSet: true,
          },
          deletedAt: {
            isSet: false,
          },
        },
        data: {
          hasCharged: true,
        },
      });

      console.log(`[CHARGE_MESSAGE] ${userId} - ${price}`);
    } catch (error) {
      console.log(`[CHARGE_MESSAGE] ${JSON.stringify(error)}`);
    }
  }

  console.log(`[CHARGE_MESSAGE] ended at: ${new Date()}`);
}

async function chargeBandwidth() {
  const fileDownloads = await prisma.fileDownload.groupBy({
    by: ['userId'],
    where: {
      hasCharged: false,
      deletedAt: {
        isSet: false,
      },
    },
    _sum: {
      size: true,
    },
  });

  for (const {
    userId,
    _sum: { size },
  } of fileDownloads) {
    const price = bandwidthToMoney(size);

    await removeBalance({
      amount: price,
      style: 'bandwidth_charge',
      userId,
      description: `Charge for ${formatSize(size)} downloaded`,
    });

    await prisma.fileDownload.updateMany({
      where: {
        userId,
        hasCharged: false,
        deletedAt: {
          isSet: false,
        },
      },
      data: {
        hasCharged: true,
      },
    });

    console.log(`[CHARGE_BANDWIDTH] ${userId} - ${price}`);
  }

  console.log(`[CHARGE_BANDWIDTH] ended at: ${new Date()}`);
}

async function chargeStorage() {
  const today = moment().set({
    hour: 0,
    minute: 0,
    second: 0,
    milliseconds: 0,
  });

  const storageSize = await prisma.storageSize.groupBy({
    where: {
      deletedAt: {
        isSet: false,
      },
      chargedAt: {
        isSet: false,
      },
      chargeAt: {
        gte: today.toDate(),
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
  } of storageSize) {
    const firstDayOfMonth = moment().startOf('month').set({
      hour: 0,
      minute: 0,
      second: 0,
      milliseconds: 0,
    });
    const days = moment().diff(firstDayOfMonth, 'days') + 1;
    const averageSize = Math.round(size / days);
    const price = storageToMoney(averageSize);

    await removeBalance({
      amount: price,
      style: 'storage_charge',
      userId,
      description: `Charge for an average of ${formatSize(averageSize)} stored`,
    });

    await prisma.storageSize.updateMany({
      where: {
        userId,
        deletedAt: {
          isSet: false,
        },
        chargedAt: {
          isSet: false,
        },
        chargeAt: {
          gte: today.toDate(),
        },
      },
      data: {
        chargedAt: new Date(),
      },
    });

    console.log(`[CHARGE_STORAGE] ${userId} - ${price}`);
  }

  console.log(`[CHARGE_STORAGE] ended at: ${new Date()}`);
}

async function removeBalance({
  amount,
  userId,
  style,
  description,
}: {
  amount: number;
  userId: string;
  style: TransactionStyle;
  description: string;
}) {
  const negativeAmount = Math.round(amount) * -1;

  if (negativeAmount === 0) {
    return;
  }

  await prisma.transaction.create({
    data: {
      amount: negativeAmount,
      style,
      userId,
      description,
    },
  });
}
