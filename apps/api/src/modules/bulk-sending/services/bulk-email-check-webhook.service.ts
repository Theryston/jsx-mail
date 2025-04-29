import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Queue } from 'bullmq';
import { CustomPrismaService } from 'nestjs-prisma';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class BulkEmailCheckWebhookService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
    @InjectQueue('get-bulk-check-result')
    private readonly getBulkCheckResultQueue: Queue,
  ) {}

  async execute(bulkEmailCheckBatchId: string) {
    const bulkEmailCheckBatch =
      await this.prisma.client.bulkEmailCheckBatch.findUnique({
        where: { id: bulkEmailCheckBatchId },
      });

    if (!bulkEmailCheckBatch) {
      throw new NotFoundException('Bulk email check batch not found');
    }

    await this.prisma.client.bulkEmailCheckBatch.update({
      where: { id: bulkEmailCheckBatchId },
      data: { status: 'waiting_to_import' },
    });

    const pendingBatches =
      await this.prisma.client.bulkEmailCheckBatch.findMany({
        where: {
          bulkEmailCheckId: bulkEmailCheckBatch.bulkEmailCheckId,
          status: { in: ['pending'] },
        },
      });

    console.log(`[BULK_EMAIL_CHECK] pending batches: ${pendingBatches.length}`);

    if (pendingBatches.length !== 0) return { success: true };

    await this.getBulkCheckResultQueue.add('get-bulk-check-result', {
      bulkEmailCheckId: bulkEmailCheckBatch.bulkEmailCheckId,
    });
  }
}
