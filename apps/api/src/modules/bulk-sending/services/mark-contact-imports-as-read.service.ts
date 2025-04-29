import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class MarkContactImportsAsReadService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute(contactImportId: string, userId: string) {
    return this.prisma.client.contactImport.update({
      where: { id: contactImportId, userId },
      data: { readFinalStatusAt: new Date() },
    });
  }
}
