import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from 'src/services/prisma.service';
import { CreateEmailCheckService } from './services/create-email-check.service';

@Processor('bulk-email-check', { concurrency: 10 })
export class BulkEmailCheckProcessor extends WorkerHost {
  private readonly PER_PAGE = 100;

  constructor(
    private readonly prisma: PrismaService,
    private readonly createEmailCheckService: CreateEmailCheckService,
  ) {
    super();
  }

  async process(job: Job) {
    console.log(`[BULK_EMAIL_CHECK] processing job ${job.id}`);
    const { bulkEmailCheckId } = job.data;

    try {
      const bulkEmailCheck =
        await this.validateBulkEmailCheck(bulkEmailCheckId);
      await this.updateBulkEmailCheckStatus(bulkEmailCheck);
      await this.processContacts(bulkEmailCheck);
    } catch (error) {
      await this.handleError(bulkEmailCheckId, error);
      throw error;
    }
  }

  private async validateBulkEmailCheck(bulkEmailCheckId: string) {
    const bulkEmailCheck = await this.prisma.bulkEmailCheck.findUnique({
      where: { id: bulkEmailCheckId },
    });

    if (!bulkEmailCheck) {
      console.log(
        `[BULK_EMAIL_CHECK] bulk email check ${bulkEmailCheckId} not found`,
      );
      throw new Error('Bulk email check not found');
    }

    if (bulkEmailCheck.status === 'completed') {
      console.log(
        `[BULK_EMAIL_CHECK] bulk email check ${bulkEmailCheckId} already completed`,
      );
      throw new Error('Bulk email check already completed');
    }

    if (bulkEmailCheck.status === 'failed') {
      console.log(
        `[BULK_EMAIL_CHECK] bulk email check ${bulkEmailCheckId} failed`,
      );
      throw new Error('Bulk email check failed');
    }

    if (!bulkEmailCheck.contactGroupId) {
      console.log(
        `[BULK_EMAIL_CHECK] bulk email check ${bulkEmailCheckId} has no contact group`,
      );
      throw new Error('Bulk email check has no contact group');
    }

    return bulkEmailCheck;
  }

  private async updateBulkEmailCheckStatus(bulkEmailCheck: any) {
    const totalEmails = await this.prisma.contact.count({
      where: { contactGroupId: bulkEmailCheck.contactGroupId, bouncedAt: null },
    });

    if (totalEmails === 0) {
      console.log(
        `[BULK_EMAIL_CHECK] bulk email check ${bulkEmailCheck.id} has no emails to check`,
      );
      throw new Error('Bulk email check has no emails to check');
    }

    await this.prisma.bulkEmailCheck.update({
      where: { id: bulkEmailCheck.id },
      data: {
        totalEmails,
        processedEmails: 0,
        status: 'processing',
        startedAt: new Date(),
      },
    });
  }

  private async processContacts(bulkEmailCheck: any) {
    let page = 1;
    let currentLine = 0;

    while (true) {
      currentLine++;
      const contacts = await this.prisma.contact.findMany({
        where: {
          contactGroupId: bulkEmailCheck.contactGroupId,
          bouncedAt: null,
          bouncedBy: null,
        },
        skip: (page - 1) * this.PER_PAGE,
        take: this.PER_PAGE,
      });

      if (contacts.length === 0) {
        break;
      }

      await this.processContactBatch(contacts, bulkEmailCheck, currentLine);
      page++;
    }
  }

  private async processContactBatch(
    contacts: any[],
    bulkEmailCheck: any,
    currentLine: number,
  ) {
    for (const contact of contacts) {
      try {
        const alreadyExists = await this.prisma.emailCheck.findFirst({
          where: {
            email: contact.email,
            bulkEmailCheckId: bulkEmailCheck.id,
          },
        });

        if (alreadyExists) {
          console.log(
            `[BULK_EMAIL_CHECK] email check ${contact.email} already exists`,
          );
          continue;
        }

        await this.createEmailCheckService.execute(
          {
            email: contact.email,
            bulkEmailCheckId: bulkEmailCheck.id,
            contactId: contact.id,
            level: bulkEmailCheck.level,
          },
          bulkEmailCheck.userId,
        );

        await this.prisma.bulkEmailCheck.update({
          where: { id: bulkEmailCheck.id },
          data: { processedEmails: currentLine },
        });
      } catch (error) {
        console.error(
          `[BULK_EMAIL_CHECK] error creating bulk email check failure for contact ${contact.email}`,
          error,
        );

        await this.prisma.bulkEmailCheckFailure.create({
          data: {
            bulkEmailCheckId: bulkEmailCheck.id,
            email: contact.email,
            reason: error.message || 'Unknown error',
          },
        });
      }
    }
  }

  private async handleError(bulkEmailCheckId: string, error: any) {
    console.error(
      `[BULK_EMAIL_CHECK] error processing job ${bulkEmailCheckId}`,
      error,
    );

    await this.prisma.bulkEmailCheck.update({
      where: { id: bulkEmailCheckId },
      data: { status: 'failed' },
    });

    await this.prisma.bulkEmailCheckFailure.create({
      data: {
        bulkEmailCheckId,
        reason: error.message || 'Unknown error',
      },
    });
  }
}
