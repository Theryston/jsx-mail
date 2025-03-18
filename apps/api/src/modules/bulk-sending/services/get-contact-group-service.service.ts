import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class GetContactGroupServiceService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string, userId: string) {
    const contactGroup = await this.prisma.contactGroup.findUnique({
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
