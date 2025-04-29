import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class DeleteContactGroupService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute(id: string, userId: string) {
    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const contactGroup = await this.prisma.client.contactGroup.findUnique({
      where: { id, userId },
    });

    if (!contactGroup) {
      throw new NotFoundException('Contact group not found');
    }

    if (contactGroup.userId !== userId && user.accessLevel !== 'other') {
      throw new ForbiddenException(
        'You are not allowed to delete this contact group',
      );
    }

    await this.prisma.client.contact.updateMany({
      where: { contactGroupId: id },
      data: { deletedBy: 'contactGroupOwner' },
    });

    await this.prisma.client.contactGroup.delete({ where: { id } });

    return {
      message: 'Contact group deleted successfully',
    };
  }
}
