import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class ContactUnsubscribeService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute(key: string) {
    if (!key) throw new BadRequestException('Key is required');

    if (key === 'sample-key') {
      return { message: 'Contact unsubscribed successfully' };
    }

    const contact = await this.prisma.client.contact.findFirst({
      where: { unsubscribeKey: key },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    await this.prisma.client.contact.update({
      where: { id: contact.id },
      data: { deletedBy: 'self' },
    });

    await this.prisma.client.contact.delete({
      where: { id: contact.id },
    });

    return {
      message: 'Contact unsubscribed successfully',
    };
  }
}
