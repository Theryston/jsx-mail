import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class ListBulkSendingFailuresService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute(id: string, userId: string, query: any) {
    const page = Number(query.page) || 1;
    const take = Number(query.take) || 10;

    const bulkSending = await this.prisma.client.bulkSending.findUnique({
      where: { id, userId },
    });

    if (!bulkSending) {
      throw new NotFoundException('Bulk sending not found');
    }

    const failures = await this.prisma.client.bulkSendingFailure.findMany({
      where: { bulkSendingId: id },
      skip: (page - 1) * take,
      take,
    });

    const totalFailures = await this.prisma.client.bulkSendingFailure.count({
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
