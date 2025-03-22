import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class DeleteContactGroupContactService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string, contactId: string, userId: string) {
    const contactGroup = await this.prisma.contactGroup.findUnique({
      where: { id, userId },
    });

    if (!contactGroup) {
      throw new NotFoundException('Contact group not found');
    }

    const contact = await this.prisma.contact.findUnique({
      where: { id: contactId, contactGroupId: id },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    await this.prisma.contact.delete({
      where: { id: contactId },
    });

    return {
      message: 'Contact deleted from contact group',
    };
  }
}
