import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Queue } from 'bullmq';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class BulkEmailCheckWebhookService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('get-bulk-check-result')
    private readonly getBulkCheckResultQueue: Queue,
  ) {}

  async execute(bulkEmailCheckBatchId: string) {
    const bulkEmailCheckBatch =
      await this.prisma.bulkEmailCheckBatch.findUnique({
        where: { id: bulkEmailCheckBatchId },
      });

    if (!bulkEmailCheckBatch) {
      throw new NotFoundException('Bulk email check batch not found');
    }

    await this.prisma.bulkEmailCheckBatch.update({
      where: { id: bulkEmailCheckBatchId },
      data: { status: 'waiting_to_import' },
    });

    const pendingBatches = await this.prisma.bulkEmailCheckBatch.findMany({
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
