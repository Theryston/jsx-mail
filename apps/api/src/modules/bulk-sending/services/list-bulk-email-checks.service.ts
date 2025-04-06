import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import {
  SAFELY_VALID_EMAIL_CHECK_RESULT,
  VALID_EMAIL_CHECK_RESULT,
} from 'src/utils/constants';

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
            notIn:
              bulkEmailCheck.level === 'valid'
                ? VALID_EMAIL_CHECK_RESULT
                : SAFELY_VALID_EMAIL_CHECK_RESULT,
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

      const validEmails = await this.prisma.emailCheck.count({
        where: {
          userId,
          bulkEmailCheckId: bulkEmailCheck.id,
          result: {
            in:
              bulkEmailCheck.level === 'valid'
                ? VALID_EMAIL_CHECK_RESULT
                : SAFELY_VALID_EMAIL_CHECK_RESULT,
          },
          status: {
            notIn: ['pending', 'processing'],
          },
        },
      });

      bulks.push({
        ...bulkEmailCheck,
        bouncedEmails,
        processedEmails,
        failedEmails,
        willRetryEmails,
        validEmails,
      });
    }

    return bulks;
  }
}
