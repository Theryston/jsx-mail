import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { messageSelect } from 'src/utils/public-selects';

type ListMessagesData = {
  take: number;
  page: number;
};

@Injectable()
export class ListMessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ take, page }: ListMessagesData, userId: string) {
    if (take > 100) take = 100;
    const skip = take * (page - 1);

    const where = {
      userId,
      deletedAt: {
        isSet: false,
      },
    };

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
      total: count,
      hasNext: skip + take < count,
      totalPages: Math.ceil(count / take),
    };
  }
}
