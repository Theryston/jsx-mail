import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class ListContactImportsService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(groupId: string, userId: string) {
    return this.prisma.contactImport.findMany({
      where: { contactGroupId: groupId, userId },
      orderBy: { createdAt: 'desc' },
      include: {
        failures: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }
}
