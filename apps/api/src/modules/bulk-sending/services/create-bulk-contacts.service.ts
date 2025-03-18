import { Injectable } from '@nestjs/common';
import { CreateBulkContactsDto } from '../bulk-sending.dto';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class CreateBulkContactsService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string, body: CreateBulkContactsDto, userId: string) {
    const { fileId, emailColumn, nameColumn } = body;

    const file = await this.prisma.file.findUnique({
      where: { id: fileId, userId },
    });

    const contactGroup = await this.prisma.contactGroup.findUnique({
      where: { id, userId },
    });

    if (!contactGroup) {
      throw new Error('Contact group not found');
    }
  }
}
