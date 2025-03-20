import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class ListBulkSendingsService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, query: any) {
    const page = Number(query.page) || 1;
    const take = Number(query.take) || 10;

    const bulkSendings = await this.prisma.bulkSending.findMany({
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

    const totalItems = await this.prisma.bulkSending.count({
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
