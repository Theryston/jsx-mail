import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class ListContactsFromContactGroupService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string, userId: string, query: any) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const search = query.search || '';

    const contactGroup = await this.prisma.contactGroup.findUnique({
      where: { id, userId },
    });

    if (!contactGroup) {
      throw new NotFoundException('Contact group not found');
    }

    const where: Prisma.ContactWhereInput = {
      contactGroupId: id,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const contacts = await this.prisma.contact.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalItems = await this.prisma.contact.count({
      where,
    });

    const totalPages = Math.ceil(totalItems / limit);

    return {
      contacts: contacts.map((contact) => ({
        id: contact.id,
        name: contact.name,
        email: contact.email,
        createdAt: contact.createdAt,
      })),
      totalItems,
      totalPages,
      currentPage: page,
    };
  }
}
