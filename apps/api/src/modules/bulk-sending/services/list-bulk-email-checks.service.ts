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
          status: {
            notIn: ['pending', 'processing', 'failed'],
          },
          willRetry: false,
        },
      });

      const processedEmails = await this.prisma.emailCheck.count({
        where: {
          userId,
          bulkEmailCheckId: bulkEmailCheck.id,
          status: {
            notIn: ['pending', 'processing'],
          },
          willRetry: false,
        },
      });

      const failedEmails = await this.prisma.emailCheck.count({
        where: {
          userId,
          bulkEmailCheckId: bulkEmailCheck.id,
          status: 'failed',
          willRetry: false,
        },
      });

      const willRetryEmails = await this.prisma.emailCheck.count({
        where: {
          userId,
          bulkEmailCheckId: bulkEmailCheck.id,
          willRetry: true,
        },
      });

      bulks.push({
        ...bulkEmailCheck,
        bouncedEmails,
        processedEmails,
        failedEmails,
        willRetryEmails,
      });
    }

    return bulks;
  }
}
