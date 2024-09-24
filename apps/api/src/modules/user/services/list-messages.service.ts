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

    let messages = await this.prisma.message.findMany({
      where: {
        userId,
        status: 'sent',
        deletedAt: {
          isSet: false,
        },
      },
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

    const count = await this.prisma.message.count({
      where: {
        userId,
        status: 'sent',
        deletedAt: {
          isSet: false,
        },
      },
    });

    return {
      messages,
      totalPages: Math.ceil(count / take),
      total: count,
      hasNext: skip + take < count,
    };
  }
}
