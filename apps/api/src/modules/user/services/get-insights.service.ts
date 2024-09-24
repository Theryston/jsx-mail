import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { PrismaService } from 'src/services/prisma.service';
import { GetBalanceService } from './get-balance.service';
import { ListSessionsService } from '../../session/services/list-sessions.service';

@Injectable()
export class GetInsightsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly getBalanceService: GetBalanceService,
    private readonly listSessionsService: ListSessionsService,
  ) {}

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

    const balance = await this.getBalanceService.execute(userId);
    const sessions = await this.listSessionsService.execute(userId);

    return {
      BALANCE: balance.friendlyAmount,
      MESSAGES_SENT: messagesSent || 0,
      STORAGE: storage || 0,
      SESSIONS: sessions.length || 0,
      MESSAGES_SENT_BY_DAY: messagesSentByDay.map((m) => ({
        sentDay: m.sentDay,
        count: m._count.id || 0,
      })),
    };
  }
}
