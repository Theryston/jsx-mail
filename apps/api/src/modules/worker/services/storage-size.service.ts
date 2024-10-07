import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import moment from 'moment';

@Injectable()
export class StorageSizeService {
  constructor(private readonly prisma: PrismaService) {}

  async execute() {
    console.log(`[STORAGE_SIZE] started at: ${new Date()}`);
    const filesUsers = await this.prisma.file.groupBy({
      where: { deletedAt: null },
      by: ['userId'],
      _sum: {
        size: true,
      },
    });

    const usersRecorded = [];

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

      const hasStorage = await this.prisma.storageSize.findFirst({
        where: {
          userId,
          createdAt: {
            gt: today.toDate(),
          },
        },
      });

      if (hasStorage) {
        console.log(`[STORAGE_SIZE] ${userId} - ${size} - skip`);
        continue;
      }

      const lastMonthDay = moment().endOf('month').set({
        hour: 0,
        minute: 0,
        second: 0,
        milliseconds: 0,
      });

      await this.prisma.storageSize.create({
        data: {
          userId,
          size,
          chargeAt: lastMonthDay.toDate(),
        },
      });

      usersRecorded.push({
        userId,
        size,
      });

      console.log(`[STORAGE_SIZE] ${userId} - ${size}`);
    }

    console.log(`[STORAGE_SIZE] ended at: ${new Date()}`);

    return {
      message: 'Worker STORAGE_SIZE finished!',
      result: usersRecorded,
    };
  }
}
