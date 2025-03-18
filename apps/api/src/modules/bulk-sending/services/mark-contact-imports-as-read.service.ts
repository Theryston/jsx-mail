import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class MarkContactImportsAsReadService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(contactImportId: string, userId: string) {
    return this.prisma.contactImport.update({
      where: { id: contactImportId, userId },
      data: { readFinalStatusAt: new Date() },
    });
  }
}
