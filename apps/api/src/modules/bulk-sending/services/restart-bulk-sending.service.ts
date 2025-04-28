import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class RestartBulkSendingService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('bulk-sending') private readonly queue: Queue,
  ) {}

  async execute(bulkSendingId: string, userId: string) {
    const bulkSending = await this.prisma.bulkSending.findUnique({
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

    await this.prisma.bulkSending.update({
      where: { id: bulkSendingId },
      data: { status: 'pending' },
    });

    await this.queue.add('send-bulk-email', {
      bulkSendingId: bulkSending.id,
    });

    return bulkSending;
  }
}
