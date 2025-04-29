import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import {
  SAFELY_VALID_EMAIL_CHECK_RESULT,
  VALID_EMAIL_CHECK_RESULT,
} from 'src/utils/constants';

@Injectable()
export class ListBulkEmailChecksService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute(
    {
      contactGroupId,
    }: {
      contactGroupId: string;
    },
    userId: string,
  ) {
    const bulks = [];

    const bulkEmailChecks = await this.prisma.client.bulkEmailCheck.findMany({
      where: { userId, contactGroupId, lastStatusReadAt: null },
      orderBy: { createdAt: 'desc' },
    });

    for (const bulkEmailCheck of bulkEmailChecks) {
      const bouncedEmails = await this.prisma.client.emailCheck.count({
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

      const processedEmails = await this.prisma.client.emailCheck.count({
        where: {
          userId,
          bulkEmailCheckId: bulkEmailCheck.id,
          status: {
            notIn: ['pending', 'processing'],
          },
          willRetry: false,
        },
      });

      const validEmails = await this.prisma.client.emailCheck.count({
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
        validEmails,
      });
    }

    return bulks;
  }
}
