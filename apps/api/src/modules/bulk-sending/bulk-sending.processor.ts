import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import axios from 'axios';
import { SenderSendEmailService } from '../sender/services/sender-send-email.service';
import moment from 'moment';
import { CreateContactService } from './services/create-contact.service';
import { GetUserLimitsService } from '../user/services/get-user-limits.service';
import { CustomPrismaService } from 'nestjs-prisma';
import {
  BulkSending,
  BulkSendingStatus,
  BulkSendingVariable,
  Contact,
  PrismaClient,
  Sender,
} from '@prisma/client';
import { Inject } from '@nestjs/common';
import pLimit from 'p-limit';
import {
  Settings,
  GetSettingsService,
} from '../user/services/get-settings.service';

const batchQueue = pLimit(30);

class UserLimitsCache {
  private limitsCache: Map<
    string,
    { availableMessages: number; balance: number; timestamp: number }
  > = new Map();
  private cacheValidityMs = 30000; // 30 seconds

  constructor() {}

  async getUserLimits(
    userId: string,
    getUserLimitsService: GetUserLimitsService,
  ): Promise<{ availableMessages: number; balance: number }> {
    const now = Date.now();
    const cached = this.limitsCache.get(userId);

    if (cached && now - cached.timestamp < this.cacheValidityMs) {
      return {
        availableMessages: cached.availableMessages,
        balance: cached.balance,
      };
    }

    const limits = await getUserLimitsService.execute(userId);
    this.limitsCache.set(userId, { ...limits, timestamp: now });
    return limits;
  }

  updateLimits(
    userId: string,
    limits: { availableMessages: number; balance: number },
  ) {
    const now = Date.now();
    this.limitsCache.set(userId, { ...limits, timestamp: now });
  }

  invalidateCache(userId: string) {
    this.limitsCache.delete(userId);
  }
}

@Processor('bulk-sending', { concurrency: 10 })
export class BulkSendingProcessor extends WorkerHost {
  private userLimitsCache: UserLimitsCache;

  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
    private readonly senderSendEmailService: SenderSendEmailService,
    private readonly createContactService: CreateContactService,
    private readonly getUserLimitsService: GetUserLimitsService,
    private readonly getSettingsService: GetSettingsService,
  ) {
    super();
    this.userLimitsCache = new UserLimitsCache();
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

    const bulkSending = await this.prisma.client.bulkSending.findUnique({
      where: { id: bulkSendingId },
      include: {
        sender: true,
        variables: true,
      },
    });

    if (!bulkSending) {
      throw new Error('Bulk sending not found');
    }

    this.updateBulkSendingStatus(bulkSendingId, 'processing').catch((error) => {
      console.error(`[BULK_SENDING] error updating status: ${error}`);
    });

    const settings = await this.getSettingsService.execute(bulkSending.userId);

    const { subject, content, contactGroupId } = bulkSending;

    console.log(
      `[BULK_SENDING] sending email to ${bulkSending.totalContacts} contacts`,
    );

    const PER_PAGE = 100;
    let page = 1;
    let insufficientBalance = false;
    let currentLine = 0;
    let gotContacts = 0;

    try {
      while (!insufficientBalance) {
        console.log(
          `[BULK_SENDING] got ${gotContacts} contacts for bulk sending ${bulkSendingId} at page ${page}`,
        );

        const contacts = await this.prisma.client.contact.findMany({
          where: {
            contactGroupId,
          },
          skip: gotContacts,
          take: PER_PAGE,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            _count: {
              select: {
                messages: {
                  where: {
                    bulkSendingId,
                    sentAt: {
                      not: null,
                    },
                  },
                },
              },
            },
          },
        });

        gotContacts += contacts.length;

        if (contacts.length === 0) {
          console.log(
            `[BULK_SENDING] no contacts found in page ${page} for bulk sending ${bulkSendingId}`,
          );
          break;
        }

        const promises = [];

        for (const contact of contacts) {
          currentLine++;

          promises.push(
            batchQueue(async () => {
              console.log(`[BULK_SENDING] processing ${currentLine}`);

              return await this.processContact(
                contact,
                bulkSending,
                insufficientBalance,
                bulkSendingId,
                subject,
                content,
                currentLine,
                settings,
              );
            }),
          );
        }

        await Promise.all(promises);

        if (insufficientBalance) {
          console.log(
            `[BULK_SENDING] stopping bulk process due to insufficient balance for ${bulkSendingId}`,
          );
          break;
        }

        page++;
      }

      console.log(
        `[BULK_SENDING] bulk sending ${bulkSendingId} queued completely`,
      );

      this.updateBulkSendingStatus(bulkSendingId, 'completed').catch(
        (error) => {
          console.error(`[BULK_SENDING] error updating status: ${error}`);
        },
      );
    } catch (error) {
      console.error(
        `[BULK_SENDING] error sending bulk email for bulk sending ${bulkSendingId}`,
        error,
      );

      this.updateBulkSendingStatus(bulkSendingId, 'failed').catch((err) => {
        console.error(`[BULK_SENDING] error updating status: ${err}`);
      });

      throw error;
    }
  }

  private async processContact(
    contact: Contact & { _count: { messages: number } },
    bulkSending: BulkSending & {
      sender: Sender;
      variables: BulkSendingVariable[];
    },
    insufficientBalance: boolean,
    bulkSendingId: string,
    subject: string,
    content: string,
    currentLine: number,
    settings: Settings,
  ) {
    if (contact._count.messages > 0) {
      console.log(
        `[BULK_SENDING] contact ${contact.email} already has a message sent. Skipping...`,
      );
      return;
    }

    if (insufficientBalance) {
      console.log(
        `[BULK_SENDING] stopped sending emails because of insufficient balance ${bulkSendingId}`,
      );
      return;
    }

    try {
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

      const { availableMessages, balance } =
        await this.userLimitsCache.getUserLimits(
          bulkSending.userId,
          this.getUserLimitsService,
        );

      if (availableMessages <= 0) {
        console.log(
          `[BULK_SENDING] insufficient balance for bulk sending ${bulkSendingId}`,
        );

        this.updateBulkSendingStatus(bulkSendingId, 'failed').catch((error) => {
          console.error(`[BULK_SENDING] error updating status: ${error}`);
        });

        this.recordBulkSendingFailure(
          bulkSendingId,
          contact.id,
          `Insufficient balance for sending email: ${balance}`,
        ).catch((error) => {
          console.error(`[BULK_SENDING] error recording failure: ${error}`);
        });

        insufficientBalance = true;
        return;
      }

      if (contact.bouncedAt) {
        const message =
          contact.bouncedBy === 'message'
            ? `Some previous message was sent to this contact (${contact.email}) and received a bounce. Skipping...`
            : `This contact (${contact.email}) was marked as bounce at ${moment(contact.bouncedAt).format('DD/MM/YYYY HH:mm:ss')} by our check email service. Skipping...`;

        console.log(`[BULK_SENDING] ${message}`);
        return;
      }

      const sendPromise = this.senderSendEmailService
        .execute(
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
        )
        .catch((error) => {
          console.error(
            `[BULK_SENDING|BACKGROUND] error sending email to ${contact.email} for bulk sending ${bulkSendingId}`,
            error,
          );

          this.recordBulkSendingFailure(
            bulkSendingId,
            contact.id,
            error.message,
            currentLine,
          ).catch((err) =>
            console.error(`[BULK_SENDING] error recording failure: ${err}`),
          );
        });

      this.userLimitsCache.updateLimits(bulkSending.userId, {
        availableMessages: availableMessages - 1,
        balance: balance - settings.pricePerMessage,
      });

      return sendPromise;
    } catch (error) {
      console.error(
        `[BULK_SENDING] error sending email to ${contact.email} for bulk sending ${bulkSendingId}`,
        error,
      );

      this.recordBulkSendingFailure(
        bulkSendingId,
        contact.id,
        error.message,
        currentLine,
      ).catch((err) =>
        console.error(`[BULK_SENDING] error recording failure: ${err}`),
      );
    }
  }

  private async updateBulkSendingStatus(
    bulkSendingId: string,
    status: BulkSendingStatus,
  ): Promise<void> {
    await this.prisma.client.bulkSending.update({
      where: { id: bulkSendingId },
      data: { status },
    });
  }

  private async recordBulkSendingFailure(
    bulkSendingId: string,
    contactId: string,
    message: string,
    line?: number,
  ): Promise<void> {
    await this.prisma.client.bulkSendingFailure.create({
      data: {
        bulkSendingId,
        contactId,
        message,
        line,
      },
    });
  }

  async createBulkContacts(data: { contactImportId: string }) {
    const { contactImportId } = data;

    console.log(`[CONTACT_BULK_IMPORT] got new job ${contactImportId}`);

    if (!contactImportId) {
      throw new Error('No contactImportId provided');
    }

    const contactImport = await this.prisma.client.contactImport.findUnique({
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
      await this.prisma.client.contactImport.update({
        where: { id: contactImportId },
        data: { status: 'processing' },
      });

      const { data: fileContent } = await axios.get(contactImport.file.url, {
        responseType: 'arraybuffer',
      });

      const csv = new TextDecoder().decode(fileContent);

      const lines = csv.split('\n');
      const headers = lines[0].split(',').map((header) => header.trim());
      const rows = lines
        .slice(1)
        .map((line) => line.split(',').map((cell) => cell.trim()));

      await this.prisma.client.contactImport.update({
        where: { id: contactImportId },
        data: {
          totalLines: rows.length,
        },
      });

      let emailColumn = headers.findIndex(
        (header) => header === contactImport.emailColumn,
      );

      let nameColumn = headers.findIndex(
        (header) => header === contactImport.nameColumn,
      );

      if (headers.length === 1) {
        emailColumn = 0;
        nameColumn = -1;
      } else {
        if (emailColumn === -1) {
          throw new Error(
            `Invalid email column! Add ${contactImport.emailColumn} to the file header`,
          );
        }
      }

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];

        let email = row[emailColumn];
        let name = nameColumn === -1 ? null : row[nameColumn];

        if (row.length === 1) {
          email = row[0];
          name = null;
        }

        email = email?.trim()?.toLowerCase();
        name = name?.trim();

        if (!email) {
          await this.prisma.client.contactImportFailure.create({
            data: {
              contactImportId,
              message: 'There is no email in the row',
              line: i + 1,
            },
          });

          await this.prisma.client.contactImport.update({
            where: { id: contactImportId },
            data: {
              processedLines: i + 1,
            },
          });

          continue;
        }

        const isValidEmail = this.validateEmail(email);

        if (!isValidEmail) {
          await this.prisma.client.contactImportFailure.create({
            data: {
              contactImportId,
              message: `The content ${email} is not a valid email`,
              line: i + 1,
            },
          });

          await this.prisma.client.contactImport.update({
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

        if (!email.includes('@simulator.amazonses.com')) {
          const existingContact = await this.prisma.client.contact.findFirst({
            where: { email, contactGroupId: contactImport.contactGroupId },
          });

          if (existingContact) {
            await this.prisma.client.contactImportFailure.create({
              data: {
                contactImportId,
                message: `The contact ${email} already exists in the contact group`,
                line: i + 1,
              },
            });

            await this.prisma.client.contactImport.update({
              where: { id: contactImportId },
              data: {
                processedLines: i + 1,
              },
            });

            continue;
          }
        }

        await this.createContactService.execute(
          {
            email,
            name,
            contactImportId,
          },
          contactImport.userId,
          contactImport.contactGroupId,
        );

        await this.prisma.client.contactImport.update({
          where: { id: contactImportId },
          data: {
            processedLines: i + 1,
          },
        });
      }

      await this.prisma.client.contactImport.update({
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

      await this.prisma.client.contactImport.update({
        where: { id: contactImportId },
        data: { status: 'failed' },
      });

      await this.prisma.client.contactImportFailure.create({
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
