import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class ListContactImportsService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute(groupId: string, userId: string) {
    return this.prisma.client.contactImport.findMany({
      where: { contactGroupId: groupId, userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            failures: true,
            contacts: true,
          },
        },
      },
    });
  }
}
