import { Injectable } from '@nestjs/common';
import { CreateBulkContactsDto } from '../bulk-sending.dto';
import { PrismaService } from 'src/services/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class CreateBulkContactsService {
  constructor(
    @InjectQueue('bulk-sending') private readonly contactsQueue: Queue,
    private readonly prisma: PrismaService,
  ) {}

  async execute(id: string, body: CreateBulkContactsDto, userId: string) {
    const { fileId, emailColumn, nameColumn } = body;

    const file = await this.prisma.file.findUnique({
      where: { id: fileId, userId },
    });

    if (!file) {
      throw new Error('File not found');
    }

    const contactGroup = await this.prisma.contactGroup.findUnique({
      where: { id, userId },
    });

    if (!contactGroup) {
      throw new Error('Contact group not found');
    }

    const contactImport = await this.prisma.contactImport.create({
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
