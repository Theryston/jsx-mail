import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { PrismaService } from 'src/services/prisma.service';
import { formatNumber } from 'src/utils/format';
import { GetUserLimitsService } from './get-user-limits.service';
import { friendlyMoney } from 'src/utils/format-money';
import { InsightsItemDto } from '../user.dto';

@Injectable()
export class GetInsightsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly getUserLimitsService: GetUserLimitsService,
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
      await this.getUserLimitsService.execute(userId);

    let balanceData: InsightsItemDto = {
      title: 'Projected balance',
      value: friendlyMoney(projectedBalance, true),
      description:
        'The messages charge runs out every day, this is the projected balance to the next charge action',
    };

    if (availableFreeMessages > 0) {
      balanceData = {
        title: 'Free emails left',
        value: availableFreeMessages.toLocaleString('en-US'),
        description:
          'The number of free emails you have left this month, if you run out, you will be charged for the messages you send and if you have no balance, you will not be able to send emails',
      };
    }

    return {
      MESSAGES_SENT_BY_DAY: messagesSentByDay.map((m) => ({
        sentDay: m.sentDay,
        count: m._count.id || 0,
      })),
      DATA: [
        balanceData,
        {
          title: 'Emails sent this month',
          value: formatNumber(totalMessages),
          description: 'The number of emails you have sent this month',
        },
        {
          title: 'Open rate',
          value: `${((openRate || 0) * 100).toFixed(2)}%`,
          description: 'The percentage of recipients who opened your email',
        },
        {
          title: 'Click rate',
          value: `${((clickRate || 0) * 100).toFixed(2)}%`,
          description:
            'The percentage of recipients who clicked on links within your email content. This metric helps measure engagement and the effectiveness of your call-to-action elements.',
        },
      ],
    };
  }
}
