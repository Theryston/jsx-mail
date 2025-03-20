import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class ListBulkSendingFailuresService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string, userId: string, query: any) {
    const page = Number(query.page) || 1;
    const take = Number(query.take) || 10;

    const bulkSending = await this.prisma.bulkSending.findUnique({
      where: { id, userId },
    });

    if (!bulkSending) {
      throw new NotFoundException('Bulk sending not found');
    }

    const failures = await this.prisma.bulkSendingFailure.findMany({
      where: { bulkSendingId: id },
      skip: (page - 1) * take,
      take,
    });

    const totalFailures = await this.prisma.bulkSendingFailure.count({
      where: { bulkSendingId: id },
    });

    const totalPages = Math.ceil(totalFailures / take);

    return {
      failures,
      totalPages,
      totalFailures,
    };
  }
}
