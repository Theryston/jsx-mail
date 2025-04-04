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
    const bulks = [];

    const bulkEmailChecks = await this.prisma.bulkEmailCheck.findMany({
      where: { userId, contactGroupId, lastStatusReadAt: null },
      orderBy: { createdAt: 'desc' },
    });

    for (const bulkEmailCheck of bulkEmailChecks) {
      const bouncedEmails = await this.prisma.emailCheck.count({
        where: {
          userId,
          bulkEmailCheckId: bulkEmailCheck.id,
          result: {
            not: 'ok',
          },
        },
      });

      const processedEmails = await this.prisma.emailCheck.count({
        where: {
          userId,
          bulkEmailCheckId: bulkEmailCheck.id,
          status: {
            notIn: ['pending', 'processing'],
          },
        },
      });

      bulks.push({
        ...bulkEmailCheck,
        bouncedEmails,
        processedEmails,
      });
    }

    return bulks;
  }
}
