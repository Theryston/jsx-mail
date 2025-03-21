import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { CreateContactDto } from '../bulk-sending.dto';
import crypto from 'crypto';

@Injectable()
export class CreateContactService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    { email, name, contactGroupId, contactImportId }: CreateContactDto,
    userId: string,
  ) {
    if (!email.includes('@simulator.amazonses.com')) {
      const existingContact = await this.prisma.contact.findFirst({
        where: { email, contactGroupId },
      });

      if (existingContact) {
        throw new BadRequestException(
          `The contact ${email} already exists in the contact group`,
        );
      }
    }

    const contactGroup = await this.prisma.contactGroup.findUnique({
      where: {
        id: contactGroupId,
        userId,
      },
    });

    if (!contactGroup) {
      throw new NotFoundException('Contact group not found');
    }

    const unsubscribeKey = crypto.randomBytes(32).toString('hex');
    const unsubscribeUrl = `${process.env.CLOUD_FRONTEND_URL}/unsubscribe?key=${unsubscribeKey}`;

    const contact = await this.prisma.contact.create({
      data: {
        email,
        name,
        unsubscribeUrl,
        unsubscribeKey,
        contactGroup: {
          connect: {
            id: contactGroupId,
          },
        },
        contactImport: contactImportId
          ? {
              connect: {
                id: contactImportId,
              },
            }
          : undefined,
      },
    });

    return contact;
  }
}
