import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class GetExportService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string, userId: string) {
    const exportItem = await this.prisma.export.findFirst({
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
