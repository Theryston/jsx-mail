import { Inject, Injectable } from '@nestjs/common';
import { messageSelect } from 'src/utils/public-selects';
import { ListMessagesDto } from '../user.dto';
import { getFilterWhereMessages } from '../utils';
import { Prisma } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class ListMessagesService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

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
      includeStatusHistory,
    } = getFilterWhereMessages(params, userId);

    const select: Prisma.MessageSelect = {
      ...messageSelect,
      sender: {
        select: {
          email: true,
        },
      },
    };

    if (includeStatusHistory) {
      select.statusHistory = {
        select: {
          id: true,
          status: true,
          description: true,
          createdAt: true,
          extras: {
            select: {
              key: true,
              value: true,
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      };
    }

    let messages = await this.prisma.client.message.findMany({
      where,
      select,
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const count = await this.prisma.client.message.count({ where });

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
