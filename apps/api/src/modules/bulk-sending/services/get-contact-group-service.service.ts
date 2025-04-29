import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class GetContactGroupServiceService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute(id: string, userId: string) {
    const contactGroup = await this.prisma.client.contactGroup.findUnique({
      where: { id, userId },
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

    if (!contactGroup) {
      throw new NotFoundException('Contact group not found');
    }

    return {
      id: contactGroup.id,
      name: contactGroup.name,
      createdAt: contactGroup.createdAt,
      contactsCount: contactGroup._count.contacts,
    };
  }
}
