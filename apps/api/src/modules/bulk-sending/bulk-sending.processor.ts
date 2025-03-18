import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from 'src/services/prisma.service';
import { CreateBulkContactsDto } from './bulk-sending.dto';
import axios from 'axios';

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

    console.log(`[CONTACT_BULK_IMPORT] got new job ${contactImportId}`);

    if (!contactImportId) {
      throw new Error('No contactImportId provided');
    }

    const contactImport = await this.prisma.contactImport.findUnique({
      where: { id: contactImportId },
      include: {
        file: true,
      },
    });

    if (!contactImport) {
      throw new Error('Contact import not found');
    }

    console.log(
      `[CONTACT_BULK_IMPORT] found contact import ${contactImportId}`,
    );

    try {
      await this.prisma.contactImport.update({
        where: { id: contactImportId },
        data: { status: 'processing' },
      });

      const { data: fileContent } = await axios.get(contactImport.file.url, {
        responseType: 'arraybuffer',
      });

      const csv = new TextDecoder().decode(fileContent);

      const lines = csv.split('\n');
      const headers = lines[0].split(',');
      const rows = lines.slice(1).map((line) => line.split(','));

      await this.prisma.contactImport.update({
        where: { id: contactImportId },
        data: {
          totalLines: rows.length,
        },
      });

      const emailColumn = headers.findIndex(
        (header) => header === contactImport.emailColumn,
      );

      const nameColumn = headers.findIndex(
        (header) => header === contactImport.nameColumn,
      );

      if (emailColumn === -1) {
        throw new Error('Invalid email column');
      }

      if (nameColumn === -1) {
        throw new Error('Invalid name column');
      }

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];

        let email = row[emailColumn];
        let name = row[nameColumn];

        if (row.length === 1) {
          email = row[0];
          name = null;
        }

        email = email?.trim()?.toLowerCase();
        name = name?.trim()?.toLowerCase();

        if (!email) {
          await this.prisma.contactImportFailure.create({
            data: {
              contactImportId,
              message: 'There is no email in the row',
              line: i + 1,
            },
          });

          await this.prisma.contactImport.update({
            where: { id: contactImportId },
            data: {
              processedLines: i + 1,
            },
          });

          continue;
        }

        const isValidEmail = this.validateEmail(email);

        if (!isValidEmail) {
          await this.prisma.contactImportFailure.create({
            data: {
              contactImportId,
              message: `The content ${email} is not a valid email`,
              line: i + 1,
            },
          });

          await this.prisma.contactImport.update({
            where: { id: contactImportId },
            data: {
              processedLines: i + 1,
            },
          });

          continue;
        }

        if (name === '' || name === '_') {
          name = null;
        }

        const existingContact = await this.prisma.contact.findFirst({
          where: { email, contactGroupId: contactImport.contactGroupId },
        });

        if (existingContact) {
          await this.prisma.contactImportFailure.create({
            data: {
              contactImportId,
              message: `The contact ${email} already exists`,
              line: i + 1,
            },
          });

          await this.prisma.contactImport.update({
            where: { id: contactImportId },
            data: {
              processedLines: i + 1,
            },
          });

          continue;
        }

        await this.prisma.contact.create({
          data: {
            email,
            name,
            contactGroup: {
              connect: {
                id: contactImport.contactGroupId,
              },
            },
            contactImport: {
              connect: {
                id: contactImportId,
              },
            },
          },
        });

        await this.prisma.contactImport.update({
          where: { id: contactImportId },
          data: {
            processedLines: i + 1,
          },
        });
      }

      await this.prisma.contactImport.update({
        where: { id: contactImportId },
        data: {
          status: 'completed',
        },
      });
    } catch (error) {
      console.error(
        `[CONTACT_BULK_IMPORT] error processing job ${contactImportId}`,
        error,
      );

      await this.prisma.contactImport.update({
        where: { id: contactImportId },
        data: { status: 'failed' },
      });

      await this.prisma.contactImportFailure.create({
        data: {
          contactImportId,
          message: error.message,
        },
      });
    }
  }

  validateEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
