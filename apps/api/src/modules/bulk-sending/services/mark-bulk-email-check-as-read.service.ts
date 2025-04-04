import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class MarkBulkEmailCheckAsReadService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(bulkEmailCheckId: string, userId: string) {
    const bulkEmailCheck = await this.prisma.bulkEmailCheck.findUnique({
      where: { id: bulkEmailCheckId, userId },
    });

    if (!bulkEmailCheck) {
      throw new NotFoundException(
        `Bulk email check with id ${bulkEmailCheckId} not found`,
      );
    }

    await this.prisma.bulkEmailCheck.update({
      where: { id: bulkEmailCheckId },
      data: { lastStatusReadAt: new Date() },
    });

    return bulkEmailCheck;
  }
}
