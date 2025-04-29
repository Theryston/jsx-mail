import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class ListBulkSendingsService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute(userId: string, query: any) {
    const page = Number(query.page) || 1;
    const take = Number(query.take) || 10;

    const bulkSendings = await this.prisma.client.bulkSending.findMany({
      where: { userId },
      skip: (page - 1) * take,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            messages: {
              where: {
                sentAt: {
                  not: null,
                },
              },
            },
            failures: true,
          },
        },
      },
    });

    const totalItems = await this.prisma.client.bulkSending.count({
      where: { userId },
    });

    const totalPages = Math.ceil(totalItems / take);

    return {
      bulkSendings,
      totalPages,
      totalItems,
      currentPage: page,
    };
  }
}
