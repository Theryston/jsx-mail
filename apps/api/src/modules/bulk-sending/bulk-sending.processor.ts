import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from 'src/services/prisma.service';
import axios from 'axios';
import { SenderSendEmailService } from '../sender/services/sender-send-email.service';
import moment from 'moment';
import crypto from 'crypto';

@Processor('bulk-sending')
export class BulkSendingProcessor extends WorkerHost {
  constructor(
    private readonly prisma: PrismaService,
    private readonly senderSendEmailService: SenderSendEmailService,
  ) {
    super();
  }

  async process(job: Job) {
    try {
      if (job.name === 'create-bulk-contacts') {
        await this.createBulkContacts(job.data);
        return;
      }

      if (job.name === 'send-bulk-email') {
        await this.sendBulkEmail(job.data);
        return;
      }

      throw new Error('Invalid job name');
    } catch (error) {
      console.error(`[BULK_SENDING] error processing job ${job.id}`, error);
      throw error;
    }
  }

  async sendBulkEmail(data: { bulkSendingId: string }) {
    const { bulkSendingId } = data;

    console.log(`[BULK_SENDING] got new job ${bulkSendingId}`);

    const bulkSending = await this.prisma.bulkSending.findUnique({
      where: { id: bulkSendingId },
      include: {
        sender: true,
        variables: true,
      },
    });

    if (!bulkSending) {
      throw new Error('Bulk sending not found');
    }

    await this.prisma.bulkSending.update({
      where: { id: bulkSendingId },
      data: { status: 'processing' },
    });

    const { subject, content, contactGroupId } = bulkSending;

    console.log(
      `[BULK_SENDING] sending email to ${bulkSending.totalContacts} contacts`,
    );

    const PER_PAGE = 100;
    let page = 1;
    try {
      while (true) {
        const contacts = await this.prisma.contact.findMany({
          where: { contactGroupId },
          skip: (page - 1) * PER_PAGE,
          take: PER_PAGE,
        });

        if (contacts.length === 0) {
          console.log(
            `[BULK_SENDING] no contacts found in page ${page} for bulk sending ${bulkSendingId}`,
          );
          break;
        }

        for (let i = 0; i < contacts.length; i++) {
          const contact = contacts[i];

          try {
            const isSent = await this.prisma.message.findFirst({
              where: {
                bulkSendingId,
                contactId: contact.id,
              },
            });

            if (isSent) {
              console.log(
                `[BULK_SENDING] skipping ${contact.email} because it was already sent`,
              );

              await this.prisma.bulkSendingFailure.create({
                data: {
                  bulkSendingId,
                  contactId: contact.id,
                  message: 'Contact already sent',
                  line: i + 1,
                },
              });

              continue;
            }

            console.log(
              `[BULK_SENDING] sending email to ${contact.email} for bulk sending ${bulkSendingId}`,
            );

            let customPayload = {};

            for (const variable of bulkSending.variables) {
              if (variable.from === 'custom') {
                customPayload[variable.key] = variable.customValue;
              }

              if (variable.from === 'contact' && variable.fromKey) {
                customPayload[variable.key] = contact[variable.fromKey];
              }

              if (variable.from === 'bulk_sending' && variable.fromKey) {
                customPayload[variable.key] = bulkSending[variable.fromKey];
              }

              if (variable.fromKey === 'createdAt') {
                customPayload[variable.key] = moment(
                  customPayload[variable.key],
                ).format('DD/MM/YYYY');
              }
            }

            const message = await this.senderSendEmailService.execute(
              {
                sender: bulkSending.sender.email,
                subject,
                html: content,
                to: [contact.email],
                bulkSendingId,
                customPayload,
                contactId: contact.id,
              },
              bulkSending.userId,
            );

            console.log(
              `[BULK_SENDING] sent email to ${contact.email} with messageId ${message.id}`,
            );
          } catch (error) {
            console.error(
              `[BULK_SENDING] error sending email to ${contact.email} for bulk sending ${bulkSendingId}`,
              error,
            );

            await this.prisma.bulkSendingFailure.create({
              data: {
                bulkSendingId,
                contactId: contact.id,
                message: error.message,
                line: i + 1,
              },
            });

            await this.prisma.bulkSending.update({
              where: { id: bulkSendingId },
              data: {
                processedContacts: {
                  increment: 1,
                },
              },
            });
          }
        }

        page++;
      }
    } catch (error) {
      console.error(
        `[BULK_SENDING] error sending bulk email for bulk sending ${bulkSendingId}`,
        error,
      );

      await this.prisma.bulkSending.update({
        where: { id: bulkSendingId },
        data: { status: 'failed' },
      });

      throw error;
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
        name = name?.trim();

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

        const unsubscribeKey = crypto.randomBytes(32).toString('hex');
        const unsubscribeUrl = `${process.env.CLOUD_FRONTEND_URL}/unsubscribe?key=${unsubscribeKey}`;

        await this.prisma.contact.create({
          data: {
            email,
            name,
            unsubscribeUrl,
            unsubscribeKey,
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
