import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from 'src/services/prisma.service';
import { CreateBulkContactsDto } from './bulk-sending.dto';

@Processor('contacts')
export class BulkSendingProcessor extends WorkerHost {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job) {
    if (job.name === 'create-bulk-contacts') {
      await this.createBulkContacts(job.data);
    }
  }

  async createBulkContacts(data: { contactImportId: string }) {
    const { contactImportId } = data;

    const contactImport = await this.prisma.contactImport.findUnique({
      where: { id: contactImportId },
    });
  }
}
