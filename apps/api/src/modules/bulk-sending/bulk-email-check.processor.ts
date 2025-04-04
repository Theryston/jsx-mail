import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { PrismaService } from 'src/services/prisma.service';

@Processor('bulk-email-check', { concurrency: 10 })
export class BulkEmailCheckProcessor extends WorkerHost {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('email-check') private readonly emailCheckQueue: Queue,
  ) {
    super();
  }

  async process(job: Job) {
    console.log(`[BULK_EMAIL_CHECK] processing job ${job.id}`);

    const { bulkEmailCheckId } = job.data;

    const bulkEmailCheck = await this.prisma.bulkEmailCheck.findUnique({
      where: { id: bulkEmailCheckId },
    });

    if (!bulkEmailCheck) {
      console.log(
        `[BULK_EMAIL_CHECK] bulk email check ${bulkEmailCheckId} not found`,
      );
      return;
    }

    try {
      if (bulkEmailCheck.status === 'completed') {
        console.log(
          `[BULK_EMAIL_CHECK] bulk email check ${bulkEmailCheckId} already completed`,
        );
        return;
      }

      if (bulkEmailCheck.status === 'failed') {
        console.log(
          `[BULK_EMAIL_CHECK] bulk email check ${bulkEmailCheckId} failed`,
        );
        return;
      }

      const { contactGroupId } = bulkEmailCheck;

      if (!contactGroupId) {
        console.log(
          `[BULK_EMAIL_CHECK] bulk email check ${bulkEmailCheckId} has no contact group`,
        );
        throw new Error('Bulk email check has no contact group');
      }

      const totalEmails = await this.prisma.contact.count({
        where: { contactGroupId, bouncedAt: null },
      });

      await this.prisma.bulkEmailCheck.update({
        where: { id: bulkEmailCheckId },
        data: { totalEmails, processedEmails: 0, status: 'processing' },
      });

      if (totalEmails === 0) {
        console.log(
          `[BULK_EMAIL_CHECK] bulk email check ${bulkEmailCheckId} has no emails to check`,
        );
        throw new Error('Bulk email check has no emails to check');
      }

      const PER_PAGE = 100;
      let page = 1;
      let currentLine = 0;

      while (true) {
        currentLine++;

        const contacts = await this.prisma.contact.findMany({
          where: { contactGroupId, bouncedAt: null, bouncedBy: null },
          skip: (page - 1) * PER_PAGE,
          take: PER_PAGE,
        });

        if (contacts.length === 0) {
          break;
        }

        for (const contact of contacts) {
          try {
            const emailCheck = await this.prisma.emailCheck.create({
              data: {
                email: contact.email,
                status: 'pending',
                result: 'unknown',
                bulkEmailCheckId,
                contactId: contact.id,
                userId: bulkEmailCheck.userId,
              },
            });

            await this.emailCheckQueue.add('email-check', {
              emailCheckId: emailCheck.id,
            });

            await this.prisma.bulkEmailCheck.update({
              where: { id: bulkEmailCheckId },
              data: { processedEmails: currentLine },
            });
          } catch (error) {
            console.error(
              `[BULK_EMAIL_CHECK] error creating bulk email check failure for contact ${contact.email}`,
              error,
            );

            await this.prisma.bulkEmailCheckFailure.create({
              data: {
                bulkEmailCheckId,
                email: contact.email,
                reason: error.message || 'Unknown error',
              },
            });
          }
        }

        page++;
      }
    } catch (error) {
      console.error(`[BULK_EMAIL_CHECK] error processing job ${job.id}`, error);
      await this.prisma.bulkEmailCheck.update({
        where: { id: bulkEmailCheckId },
        data: { status: 'failed' },
      });

      await this.prisma.bulkEmailCheckFailure.create({
        data: { bulkEmailCheckId, reason: error.message || 'Unknown error' },
      });

      throw error;
    }
  }
}
