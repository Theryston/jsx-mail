import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class ContactUnsubscribeService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(key: string) {
    if (!key) throw new BadRequestException('Key is required');

    const contact = await this.prisma.contact.findFirst({
      where: { unsubscribeKey: key },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    await this.prisma.contact.update({
      where: { id: contact.id },
      data: { deletedBy: 'self' },
    });

    await this.prisma.contact.delete({
      where: { id: contact.id },
    });

    return {
      message: 'Contact unsubscribed successfully',
    };
  }
}
