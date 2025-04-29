import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class DeleteContactGroupContactService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute(id: string, contactId: string, userId: string) {
    const contactGroup = await this.prisma.client.contactGroup.findUnique({
      where: { id, userId },
    });

    if (!contactGroup) {
      throw new NotFoundException('Contact group not found');
    }

    const contact = await this.prisma.client.contact.findUnique({
      where: { id: contactId, contactGroupId: id },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    await this.prisma.client.contact.delete({
      where: { id: contactId },
    });

    return {
      message: 'Contact deleted from contact group',
    };
  }
}
