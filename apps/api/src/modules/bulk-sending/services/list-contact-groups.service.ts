import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class ListContactGroupsService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute(userId: string, query: any) {
    const page = Number(query.page) || 1;
    const take = Number(query.take) || 10;

    const contactGroups = await this.prisma.client.contactGroup.findMany({
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

    const totalItems = await this.prisma.client.contactGroup.count({
      where: { userId },
    });
    const totalPages = Math.ceil(totalItems / take);

    const promises = contactGroups.map(async (contactGroup) => {
      const validContactsCount = await this.prisma.client.contact.count({
        where: {
          contactGroupId: contactGroup.id,
          deletedAt: null,
          bouncedAt: null,
        },
      });

      return {
        id: contactGroup.id,
        name: contactGroup.name,
        createdAt: contactGroup.createdAt,
        contactsCount: contactGroup._count.contacts,
        validContactsCount,
      };
    });

    return {
      contactGroups: await Promise.all(promises),
      totalItems,
      totalPages,
      currentPage: page,
    };
  }
}
