import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { BulkEmailCheck, Contact } from '@prisma/client';
import {
  GetSettingsService,
  Settings,
} from '../user/services/get-settings.service';
import axios, { AxiosInstance } from 'axios';
import { Inject } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { PrismaClient } from '@prisma/client';

@Processor('bulk-email-check', { concurrency: 10 })
export class BulkEmailCheckProcessor extends WorkerHost {
  truelistClient: AxiosInstance;

  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
    private readonly getSettingsService: GetSettingsService,
  ) {
    super();

    this.truelistClient = axios.create({
      baseURL: 'https://api.truelist.io/api',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.TRUELIST_API_KEY}`,
      },
    });
  }

  async process(job: Job) {
    console.log(`[BULK_EMAIL_CHECK] processing job ${job.id}`);
    const { bulkEmailCheckId } = job.data;

    try {
      const bulkEmailCheck =
        await this.validateBulkEmailCheck(bulkEmailCheckId);
      await this.updateBulkEmailCheckStatus(bulkEmailCheck);
      const settings = await this.getSettingsService.execute(
        bulkEmailCheck.userId,
      );
      await this.processContacts(bulkEmailCheck, settings);
    } catch (error) {
      await this.handleError(bulkEmailCheckId, error);
      throw error;
    }
  }

  private async validateBulkEmailCheck(bulkEmailCheckId: string) {
    const bulkEmailCheck = await this.prisma.client.bulkEmailCheck.findUnique({
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

  private async updateBulkEmailCheckStatus(bulkEmailCheck: BulkEmailCheck) {
    const totalEmails = await this.prisma.client.contact.count({
      where: { contactGroupId: bulkEmailCheck.contactGroupId, bouncedAt: null },
    });

    if (totalEmails === 0) {
      console.log(
        `[BULK_EMAIL_CHECK] bulk email check ${bulkEmailCheck.id} has no emails to check`,
      );
      throw new Error('Bulk email check has no emails to check');
    }

    await this.prisma.client.bulkEmailCheck.update({
      where: { id: bulkEmailCheck.id },
      data: {
        totalEmails,
        processedEmails: 0,
        status: 'processing',
        startedAt: new Date(),
      },
    });
  }

  private async processContacts(
    bulkEmailCheck: BulkEmailCheck,
    settings: Settings,
  ) {
    let page = 1;
    let currentLine = 0;

    while (true) {
      currentLine++;

      const contacts = await this.prisma.client.contact.findMany({
        where: {
          contactGroupId: bulkEmailCheck.contactGroupId,
          bouncedAt: null,
          bouncedBy: null,
        },
        skip: (page - 1) * settings.globalBulkEmailCheckMaxBatchSize,
        take: settings.globalBulkEmailCheckMaxBatchSize,
      });

      if (contacts.length === 0) break;

      await this.processContactBatch(contacts, bulkEmailCheck);

      page++;
    }
  }

  private async processContactBatch(
    contacts: Contact[],
    bulkEmailCheck: BulkEmailCheck,
  ) {
    const processedContacts = contacts.map((contact) => {
      return [contact.email];
    });

    if (processedContacts.length === 0) return;

    if (processedContacts.length === 1) {
      processedContacts.push(processedContacts[0]);
    }

    const bulkEmailCheckBatch =
      await this.prisma.client.bulkEmailCheckBatch.create({
        data: {
          bulkEmailCheckId: bulkEmailCheck.id,
          status: 'pending',
        },
      });

    const webhookUrl = `${process.env.API_BASE_URL}/bulk-sending/bulk-email-check/webhook/${bulkEmailCheckBatch.id}`;

    console.log(`[BULK_EMAIL_CHECK] webhook url: ${webhookUrl}`);

    const { data: batchResult } = await this.truelistClient.post(
      '/v1/batches',
      {
        data: processedContacts,
        webhook_url: webhookUrl,
        filename: `${bulkEmailCheckBatch.id}.csv`,
      },
    );

    await this.prisma.client.bulkEmailCheckBatch.update({
      where: { id: bulkEmailCheckBatch.id },
      data: { status: 'pending', externalId: batchResult.id },
    });

    console.log(`Added batch ${bulkEmailCheckBatch.id} to truelist`);
  }

  private async handleError(bulkEmailCheckId: string, error: any) {
    error = error?.response?.data || error;

    console.error(
      `[BULK_EMAIL_CHECK] error processing job ${bulkEmailCheckId}`,
      error,
    );

    await this.prisma.client.bulkEmailCheck.update({
      where: { id: bulkEmailCheckId },
      data: { status: 'failed' },
    });

    await this.prisma.client.bulkEmailCheckFailure.create({
      data: {
        bulkEmailCheckId,
        reason: error.message || error.error || 'Unknown error',
      },
    });
  }
}
