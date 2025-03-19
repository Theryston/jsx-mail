import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class ListBulkSendingsService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string) {
    return this.prisma.bulkSending.findMany({
      where: { userId },
      include: {
        _count: {
          select: { messages: true, failures: true },
        },
      },
    });
  }
}
