import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class ListBulkEmailChecksService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    {
      contactGroupId,
    }: {
      contactGroupId: string;
    },
    userId: string,
  ) {
    const bulkEmailChecks = await this.prisma.bulkEmailCheck.findMany({
      where: { userId, contactGroupId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            results: {
              where: {
                status: {
                  notIn: ['pending', 'processing'],
                },
              },
            },
          },
        },
      },
    });

    return bulkEmailChecks;
  }
}
