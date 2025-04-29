import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class MarkBulkEmailCheckAsReadService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute(bulkEmailCheckId: string, userId: string) {
    const bulkEmailCheck = await this.prisma.client.bulkEmailCheck.findUnique({
      where: { id: bulkEmailCheckId, userId },
    });

    if (!bulkEmailCheck) {
      throw new NotFoundException(
        `Bulk email check with id ${bulkEmailCheckId} not found`,
      );
    }

    await this.prisma.client.bulkEmailCheck.update({
      where: { id: bulkEmailCheckId },
      data: { lastStatusReadAt: new Date() },
    });

    return bulkEmailCheck;
  }
}
