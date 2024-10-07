import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { PrismaService } from 'src/services/prisma.service';
import { GetBalanceService } from './get-balance.service';

@Injectable()
export class GetInsightsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly getBalanceService: GetBalanceService,
  ) {}

  async execute(userId: string) {
    const monthStart = moment().startOf('month');
    const messagesCount = await this.prisma.message.groupBy({
      by: ['status'],
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

    const totalMessages = messagesCount.reduce(
      (acc, curr) => acc + curr._count.id,
      0,
    );

    const openRate =
      (messagesCount.find((m) => m.status === 'opened')?._count.id || 0) /
      totalMessages;
    const clickRate =
      (messagesCount.find((m) => m.status === 'clicked')?._count.id || 0) /
      totalMessages;

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

    const balance = await this.getBalanceService.execute(userId);

    return {
      BALANCE: balance.friendlyAmount,
      MESSAGES_SENT: totalMessages,
      CLICK_RATE: clickRate,
      OPEN_RATE: openRate,
      MESSAGES_SENT_BY_DAY: messagesSentByDay.map((m) => ({
        sentDay: m.sentDay,
        count: m._count.id || 0,
      })),
    };
  }
}
