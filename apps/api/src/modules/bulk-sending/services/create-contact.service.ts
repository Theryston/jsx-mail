import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { CreateContactDto } from '../bulk-sending.dto';
import crypto from 'crypto';
import { MarkBounceToService } from 'src/modules/email/services/mark-bounce-to.service';
import { Prisma } from '@prisma/client';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Injectable()
export class CreateContactService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly markBounceToService: MarkBounceToService,
  ) {}

  async execute(
    { email, name, contactImportId }: CreateContactDto,
    userId: string,
    contactGroupId: string,
  ) {
    email = email.toLowerCase().trim();

    if (!EMAIL_REGEX.test(email)) {
      throw new BadRequestException('Invalid email address');
    }

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

    const processingBulkEmailCheck = await this.prisma.bulkEmailCheck.findFirst(
      {
        where: {
          userId,
          contactGroupId: contactGroup.id,
          status: { in: ['processing', 'pending'] },
        },
      },
    );

    if (processingBulkEmailCheck) {
      throw new BadRequestException(
        'Wait for the email check to finish before sending emails',
      );
    }

    const unsubscribeKey = crypto.randomBytes(32).toString('hex');
    const unsubscribeUrl = `${process.env.CLOUD_FRONTEND_URL}/unsubscribe?key=${unsubscribeKey}`;

    const data: Prisma.ContactCreateInput = {
      email,
      name,
      unsubscribeUrl,
      unsubscribeKey,
      contactGroup: {
        connect: {
          id: contactGroupId,
        },
      },
    };

    if (contactImportId) {
      data.contactImport = {
        connect: {
          id: contactImportId,
        },
      };
    }

    const markedBounceTo = await this.markBounceToService.get(email);

    if (markedBounceTo) {
      data.bouncedAt = markedBounceTo.createdAt;
      data.bouncedBy = markedBounceTo.bounceBy;
    }

    const contact = await this.prisma.contact.create({
      data,
    });

    return contact;
  }
}
