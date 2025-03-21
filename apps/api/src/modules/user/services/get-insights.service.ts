import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { PrismaService } from 'src/services/prisma.service';
import { formatNumber } from 'src/utils/format';
import { GetAvailableUserFreeLimitService } from './get-available-user-free-limit.service';
import { friendlyMoney } from 'src/utils/format-money';

@Injectable()
export class GetInsightsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly getAvailableUserFreeLimitService: GetAvailableUserFreeLimitService,
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

    const { availableFreeMessages, projectedBalance } =
      await this.getAvailableUserFreeLimitService.execute(userId);

    let balanceData = {
      title: 'Projected balance',
      value: friendlyMoney(projectedBalance),
    };

    if (availableFreeMessages > 0) {
      balanceData = {
        title: 'Free emails left',
        value: availableFreeMessages.toLocaleString('en-US'),
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
        { title: 'Open rate', value: `${((openRate || 0) * 100).toFixed(2)}%` },
        {
          title: 'Click rate',
          value: `${((clickRate || 0) * 100).toFixed(2)}%`,
        },
      ],
    };
  }
}
