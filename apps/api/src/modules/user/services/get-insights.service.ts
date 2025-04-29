import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { formatNumber } from 'src/utils/format';
import { GetUserLimitsService } from './get-user-limits.service';
import { friendlyMoney } from 'src/utils/format-money';
import { InsightsItemDto } from '../user.dto';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import { Inject } from '@nestjs/common';

@Injectable()
export class GetInsightsService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
    private readonly getUserLimitsService: GetUserLimitsService,
  ) {}

  async execute(userId: string) {
    const last30Days = moment().subtract(30, 'days');

    const messagesCount = await this.prisma.client.message.groupBy({
      by: ['status'],
      where: {
        deletedAt: null,
        sentAt: {
          gte: last30Days.toDate(),
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

    const messagesSentByDay = await this.prisma.client.message.groupBy({
      by: ['sentDay'],
      where: {
        deletedAt: null,
        sentAt: {
          gte: last30Days.toDate(),
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
      MESSAGES_SENT_BY_DAY: messagesSentByDay
        .map((m) => ({
          sentDay: m.sentDay,
          count: m._count.id || 0,
        }))
        .sort((a, b) => a.sentDay.localeCompare(b.sentDay)),
      DATA: [
        balanceData,
        {
          title: 'Recently sent emails',
          value: formatNumber(totalMessages),
          description: 'The number of emails you have sent in the last 30 days',
        },
        {
          title: 'Recently opened emails',
          value: `${((openRate || 0) * 100).toFixed(2)}%`,
          description:
            'The percentage of recipients who opened your email in the last 30 days. This metric helps measure the effectiveness of your email campaigns and the engagement of your audience.',
        },
        {
          title: 'Recently clicked emails',
          value: `${((clickRate || 0) * 100).toFixed(2)}%`,
          description:
            'The percentage of recipients who clicked on links within your email content in the last 30 days. This metric helps measure engagement and the effectiveness of your call-to-action elements.',
        },
      ],
    };
  }
}
