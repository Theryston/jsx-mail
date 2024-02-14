import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class GetInsightsService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string) {
    const monthStart = moment().startOf('month');
    const {
      _count: { id: messagesSent },
    } = await this.prisma.message.aggregate({
      where: {
        deletedAt: {
          isSet: false,
        },
        sentAt: {
          gte: monthStart.toDate(),
        },
        userId,
      },
      _count: {
        id: true,
      },
    });
    const messagesSentByDay = await this.prisma.message.groupBy({
      by: ['sentDay'],
      where: {
        deletedAt: {
          isSet: false,
        },
        sentAt: {
          gte: monthStart.toDate(),
        },
        sentDay: {
          isSet: true,
        },
        userId,
      },
      _count: {
        id: true,
      },
    });
    const {
      _sum: { size: storage },
    } = await this.prisma.file.aggregate({
      where: {
        deletedAt: {
          isSet: false,
        },
        userId,
      },
      _sum: {
        size: true,
      },
    });
    const {
      _sum: { size: download },
    } = await this.prisma.fileDownload.aggregate({
      where: {
        deletedAt: {
          isSet: false,
        },
        createdAt: {
          gte: monthStart.toDate(),
        },
        userId,
      },
      _sum: {
        size: true,
      },
    });

    return {
      MESSAGES_SENT: messagesSent || 0,
      MESSAGES_SENT_BY_DAY: messagesSentByDay.map((m) => ({
        sentDay: m.sentDay,
        count: m._count.id || 0,
      })),
      STORAGE: storage || 0,
      DOWNLOAD: download || 0,
    };
  }
}
