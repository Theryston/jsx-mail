import { Injectable, NotFoundException } from '@nestjs/common';
import { ExportMessagesDto } from '../user.dto';
import { PrismaService } from 'src/services/prisma.service';
import { getFilterWhereMessages } from '../utils';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ExportStatus } from '@prisma/client';

@Injectable()
export class ExportMessagesService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('user') private readonly queue: Queue,
  ) {}

  async execute(params: ExportMessagesDto, userId: string) {
    const { where, startDate, endDate, statuses } = getFilterWhereMessages(
      params,
      userId,
    );

    const count = await this.prisma.message.count({
      where,
    });

    if (count === 0) {
      throw new NotFoundException('No messages found');
    }

    const exportItem = await this.prisma.export.create({
      data: {
        userId,
        where: JSON.stringify(where),
        format: params.format,
        startDate,
        endDate,
        statuses,
        exportStatus: ExportStatus.pending,
      },
    });

    this.queue.add('export-messages', {
      exportId: exportItem.id,
    });

    return exportItem;
  }
}
