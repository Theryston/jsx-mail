import { Injectable, NotFoundException } from '@nestjs/common';
import { ExportMessagesDto } from '../user.dto';
import { getFilterWhereMessages } from '../utils';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ExportStatus } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import { Inject } from '@nestjs/common';

@Injectable()
export class ExportMessagesService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
    @InjectQueue('user') private readonly queue: Queue,
  ) {}

  async execute(params: ExportMessagesDto, userId: string) {
    const { where, startDate, endDate, statuses } = getFilterWhereMessages(
      params,
      userId,
    );

    const count = await this.prisma.client.message.count({
      where,
    });

    if (count === 0) {
      throw new NotFoundException('No messages found');
    }

    const exportItem = await this.prisma.client.export.create({
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
