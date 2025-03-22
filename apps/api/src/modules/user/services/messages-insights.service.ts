import { Injectable } from '@nestjs/common';
import { MessagesInsightsDto } from '../user.dto';
import { getFilterWhereMessages } from '../utils';
import { PrismaService } from 'src/services/prisma.service';
import moment from 'moment';
import { MESSAGES_STATUS } from '../../../utils/constants';

@Injectable()
export class MessagesInsightsService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(params: MessagesInsightsDto, userId: string) {
    const { where, startDate, endDate, statuses } = getFilterWhereMessages(
      params,
      userId,
    );

    const messages = await this.prisma.message.groupBy({
      by: ['createdDay', 'status'],
      where,
      _count: {
        id: true,
      },
      orderBy: {
        createdDay: 'desc',
      },
    });

    const days = this.getDays({ startDate, endDate });
    let allStatuses = MESSAGES_STATUS.map((status) => status.value);
    if (statuses && statuses.length > 0) allStatuses = statuses;

    const messagesResult = allStatuses.map((status) => {
      return {
        days: days.map(
          (day) =>
            messages.find((m) => m.createdDay === day && m.status === status)
              ?._count.id || 0,
        ),
        status: status,
        color: MESSAGES_STATUS.find((s) => s.value === status).color,
      };
    });

    const processingMessages = await this.prisma.message.count({
      where: {
        status: {
          in: ['queued', 'processing'],
        },
        userId,
        deletedAt: null,
      },
    });

    return {
      DAYS: days,
      STATUSES: allStatuses,
      MESSAGES: messagesResult,
      PROCESSING_MESSAGES: processingMessages,
    };
  }

  private getDays({ startDate, endDate }: any) {
    const startDateMoment = moment(startDate);
    const endDateMoment = moment(endDate);

    const days = [];

    for (
      let day = startDateMoment;
      day <= endDateMoment;
      day = day.add(1, 'day')
    ) {
      const dayString = day.format('YYYY-MM-DD');
      days.push(dayString);
    }

    return days;
  }
}
