import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { PrismaService } from 'src/services/prisma.service';
import { GetBalanceService } from './get-balance.service';
import { FREE_EMAILS_PER_MONTH } from 'src/utils/constants';
import { friendlyMoney } from 'src/utils/format-money';
import { formatNumber } from 'src/utils/format';

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
        deletedAt: null,
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
        deletedAt: null,
        sentAt: {
          gte: monthStart.toDate(),
        },
        sentDay: {
          not: null,
        },
        userId,
      },
      _count: {
        id: true,
      },
    });

    const balance = await this.getBalanceService.execute(userId);

    let balanceData = {
      title: 'Your balance',
      value: balance.friendlyAmount,
    };

    if (totalMessages < FREE_EMAILS_PER_MONTH) {
      balanceData = {
        title: 'Free emails left',
        value: (FREE_EMAILS_PER_MONTH - totalMessages).toLocaleString('en-US'),
      };
    }

    return {
      MESSAGES_SENT_BY_DAY: messagesSentByDay.map((m) => ({
        sentDay: m.sentDay,
        count: m._count.id || 0,
      })),
      DATA: [
        balanceData,
        { title: 'Emails sent this month', value: formatNumber(totalMessages) },
        { title: 'Open rate', value: `${(openRate * 100).toFixed(2)}%` },
        { title: 'Click rate', value: `${(clickRate * 100).toFixed(2)}%` },
      ],
    };
  }
}
