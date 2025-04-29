import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { CreateBulkContactsDto } from '../bulk-sending.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class CreateBulkContactsService {
  constructor(
    @InjectQueue('bulk-sending') private readonly contactsQueue: Queue,
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute(id: string, body: CreateBulkContactsDto, userId: string) {
    const { fileId, emailColumn, nameColumn } = body;

    const file = await this.prisma.client.file.findUnique({
      where: { id: fileId, userId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    const contactGroup = await this.prisma.client.contactGroup.findUnique({
      where: { id, userId },
    });

    if (!contactGroup) {
      throw new NotFoundException('Contact group not found');
    }

    const processingContactImport =
      await this.prisma.client.contactImport.findFirst({
        where: {
          userId,
          contactGroupId: contactGroup.id,
          status: { in: ['processing', 'pending'] },
        },
      });

    if (processingContactImport) {
      throw new BadRequestException(
        'Wait for the contact import to finish before sending emails',
      );
    }

    const processingBulkEmailCheck =
      await this.prisma.client.bulkEmailCheck.findFirst({
        where: {
          userId,
          contactGroupId: contactGroup.id,
          status: { in: ['processing', 'pending'] },
        },
      });

    if (processingBulkEmailCheck) {
      throw new BadRequestException(
        'Wait for the email check to finish before sending emails',
      );
    }

    const contactImport = await this.prisma.client.contactImport.create({
      data: {
        fileId,
        emailColumn,
        nameColumn,
        userId,
        contactGroupId: contactGroup.id,
      },
    });

    await this.contactsQueue.add('create-bulk-contacts', {
      contactImportId: contactImport.id,
    });

    return contactImport;
  }
}
