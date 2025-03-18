import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class DeleteContactGroupService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const contactGroup = await this.prisma.contactGroup.findUnique({
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

    await this.prisma.contactGroup.delete({ where: { id } });

    return {
      message: 'Contact group deleted successfully',
    };
  }
}
