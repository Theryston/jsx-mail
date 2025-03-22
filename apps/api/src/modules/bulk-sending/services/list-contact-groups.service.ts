import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class ListContactGroupsService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, query: any) {
    const page = Number(query.page) || 1;
    const take = Number(query.take) || 10;

    const contactGroups = await this.prisma.contactGroup.findMany({
      where: { userId },
      skip: (page - 1) * take,
      take,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: {
            contacts: {
              where: {
                deletedAt: null,
              },
            },
          },
        },
      },
    });

    const totalItems = await this.prisma.contactGroup.count({
      where: { userId },
    });
    const totalPages = Math.ceil(totalItems / take);

    return {
      contactGroups: contactGroups.map((contactGroup) => ({
        id: contactGroup.id,
        name: contactGroup.name,
        createdAt: contactGroup.createdAt,
        contactsCount: contactGroup._count.contacts,
      })),
      totalItems,
      totalPages,
      currentPage: page,
    };
  }
}
