import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { messageSelect } from 'src/utils/public-selects';
import { ListMessagesDto } from '../user.dto';
import { getFilterWhereMessages } from '../utils';

@Injectable()
export class ListMessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(params: ListMessagesDto, userId: string) {
    const {
      skip,
      take,
      where,
      page,
      startDate,
      endDate,
      fromEmail,
      toEmail,
      statuses,
    } = getFilterWhereMessages(params, userId);

    let messages = await this.prisma.message.findMany({
      where,
      select: {
        ...messageSelect,
        sender: {
          select: {
            email: true,
          },
        },
      },
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const count = await this.prisma.message.count({ where });

    return {
      messages,
      take,
      page,
      skip,
      total: count,
      endDate,
      startDate,
      fromEmail,
      toEmail,
      statuses,
      hasNext: skip + take < count,
      totalPages: Math.ceil(count / take),
    };
  }
}
