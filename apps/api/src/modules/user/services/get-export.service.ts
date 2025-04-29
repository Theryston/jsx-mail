import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class GetExportService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute(id: string, userId: string) {
    const exportItem = await this.prisma.client.export.findFirst({
      where: { id, userId },
      include: {
        file: true,
      },
    });

    if (!exportItem) {
      throw new NotFoundException('Export not found');
    }

    return exportItem;
  }
}
