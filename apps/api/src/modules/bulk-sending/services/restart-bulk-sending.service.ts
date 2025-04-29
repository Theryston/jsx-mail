import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class RestartBulkSendingService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
    @InjectQueue('bulk-sending') private readonly queue: Queue,
  ) {}

  async execute(bulkSendingId: string, userId: string) {
    const bulkSending = await this.prisma.client.bulkSending.findUnique({
      where: {
        id: bulkSendingId,
        userId,
      },
    });

    if (!bulkSending) {
      throw new NotFoundException('Bulk sending not found');
    }

    if (bulkSending.status !== 'completed') {
      throw new BadRequestException(
        'Only completed bulk sendings can be restarted',
      );
    }

    await this.prisma.client.bulkSending.update({
      where: { id: bulkSendingId },
      data: { status: 'pending' },
    });

    await this.queue.add('send-bulk-email', {
      bulkSendingId: bulkSending.id,
    });

    return bulkSending;
  }
}
