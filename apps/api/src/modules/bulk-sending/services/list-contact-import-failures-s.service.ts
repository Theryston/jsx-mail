import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class ListContactImportFailuresSService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(contactImportId: string, userId: string, query: any) {
    const page = Number(query.page) || 1;
    const perPage = Number(query.take) || 10;

    const contactImport = await this.prisma.contactImport.findUnique({
      where: { id: contactImportId, userId },
    });

    if (!contactImport) {
      throw new NotFoundException('Contact import not found');
    }

    const failures = await this.prisma.contactImportFailure.findMany({
      where: { contactImportId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    });

    const totalItems = await this.prisma.contactImportFailure.count({
      where: { contactImportId },
    });

    const totalPages = Math.ceil(totalItems / perPage);

    return {
      failures,
      totalItems,
      totalPages,
      currentPage: page,
    };
  }
}
