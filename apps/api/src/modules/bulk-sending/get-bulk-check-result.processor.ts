import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from 'src/services/prisma.service';
import axios, { AxiosInstance } from 'axios';
import { CreateEmailCheckService } from './services/create-email-check.service';
import {
  EMAIL_CHECK_RESULT_MAP,
  SAFELY_VALID_EMAIL_CHECK_RESULT,
  VALID_EMAIL_CHECK_RESULT,
} from 'src/utils/constants';
import { MarkBounceToService } from '../email/services/mark-bounce-to.service';
import { EmailCheckResult } from '@prisma/client';
import { EmailCheck } from '@prisma/client';
import { QueueChargeBulkEmailCheckService } from '../worker/services/queue-charge-bulk-email-check.service';

@Processor('get-bulk-check-result', { concurrency: 10 })
export class GetBulkCheckResultProcessor extends WorkerHost {
  truelistClient: AxiosInstance;

  constructor(
    private readonly prisma: PrismaService,
    private readonly createEmailCheckService: CreateEmailCheckService,
    private readonly markBounceToService: MarkBounceToService,
    private readonly queueChargeBulkEmailCheckService: QueueChargeBulkEmailCheckService,
  ) {
    super();

    this.truelistClient = axios.create({
      baseURL: 'https://api.truelist.io/api',
      headers: {
        Authorization: `Bearer ${process.env.TRUELIST_API_KEY}`,
      },
    });
  }

  async process(job: Job) {
    console.log(`[GET_BULK_CHECK_RESULT] processing job ${job.id}`);

    const { bulkEmailCheckId } = job.data;

    if (!bulkEmailCheckId) {
      console.log(`[GET_BULK_CHECK_RESULT] bulkEmailCheckId is required`);
      return;
    }

    const bulkEmailCheck = await this.prisma.bulkEmailCheck.findUnique({
      where: { id: bulkEmailCheckId },
    });

    if (!bulkEmailCheck) {
      console.log(`[GET_BULK_CHECK_RESULT] bulkEmailCheck not found`);
      return;
    }

    if (bulkEmailCheck.status === 'completed') {
      console.log(
        `[GET_BULK_CHECK_RESULT] bulkEmailCheck ${bulkEmailCheck.id} already completed`,
      );
      return;
    }

    const bulkEmailCheckBatches =
      await this.prisma.bulkEmailCheckBatch.findMany({
        where: { bulkEmailCheckId, status: { in: ['waiting_to_import'] } },
      });

    for (const bulkEmailCheckBatch of bulkEmailCheckBatches) {
      console.log(
        `[GET_BULK_CHECK_RESULT] processing batch ${bulkEmailCheckBatch.id} with externalId ${bulkEmailCheckBatch.externalId}`,
      );

      if (bulkEmailCheckBatch.status === 'completed') {
        console.log(
          `[GET_BULK_CHECK_RESULT] batch ${bulkEmailCheckBatch.id} already completed`,
        );
        continue;
      }

      let page = 1;

      while (true) {
        try {
          console.log(
            `[GET_BULK_CHECK_RESULT] processing batch ${bulkEmailCheckBatch.id} page ${page}`,
          );

          const response = await this.truelistClient.get(
            '/v1/email_addresses',
            {
              params: {
                batch_uuid: bulkEmailCheckBatch.externalId,
                page,
                per_page: 100,
              },
            },
          );

          const batchResult = response.data;

          const emailAddresses = batchResult.email_addresses;

          if (emailAddresses.length === 0) {
            console.log(
              `[GET_BULK_CHECK_RESULT] batch ${bulkEmailCheckBatch.id} page ${page} has no email addresses. Finished importing emails.`,
            );
            break;
          }

          for (const emailAddress of emailAddresses) {
            console.log(
              `[GET_BULK_CHECK_RESULT] batch ${bulkEmailCheckBatch.id} page ${page} email address ${emailAddress.address} ${emailAddress.email_state}`,
            );

            const result = EMAIL_CHECK_RESULT_MAP[emailAddress.email_state];

            if (!result) {
              console.log(
                `[GET_BULK_CHECK_RESULT] batch ${bulkEmailCheckBatch.id} page ${page} email address ${emailAddress.address} has no result.`,
              );
              continue;
            }

            const contact = await this.prisma.contact.findFirst({
              where: {
                email: emailAddress.address,
                contactGroupId: bulkEmailCheck.contactGroupId,
              },
            });

            const emailCheck = await this.createEmailCheckService.execute(
              {
                email: emailAddress.address,
                bulkEmailCheckId: bulkEmailCheck.id,
                level: bulkEmailCheck.level,
                contactId: contact?.id,
                status: 'completed',
                result,
              },
              bulkEmailCheck.userId,
            );

            await this.handleBounce(emailCheck, result);
          }

          page++;
        } catch (error) {
          console.error(error);
        }
      }

      await this.truelistClient.delete(
        `/v1/batches/${bulkEmailCheckBatch.externalId}`,
      );

      await this.prisma.bulkEmailCheckBatch.update({
        where: { id: bulkEmailCheckBatch.id },
        data: { status: 'completed' },
      });

      console.log(
        `[GET_BULK_CHECK_RESULT] batch ${bulkEmailCheckBatch.id} finished importing emails.`,
      );
    }

    await this.prisma.bulkEmailCheck.update({
      where: { id: bulkEmailCheck.id },
      data: { status: 'completed' },
    });

    await this.queueChargeBulkEmailCheckService.add(
      bulkEmailCheck.userId,
      bulkEmailCheck.id,
    );
  }

  private async handleBounce(emailCheck: EmailCheck, result: EmailCheckResult) {
    if (!VALID_EMAIL_CHECK_RESULT.includes(result)) {
      await this.markBounceToService.create(emailCheck.email, 'email_check');
    }

    if (!emailCheck.contactId) return;

    if (
      emailCheck.level === 'safely' &&
      !SAFELY_VALID_EMAIL_CHECK_RESULT.includes(result)
    ) {
      await this.prisma.contact.update({
        where: { id: emailCheck.contactId },
        data: { bouncedAt: new Date(), bouncedBy: 'email_check' },
      });
    }

    if (
      emailCheck.level === 'valid' &&
      !VALID_EMAIL_CHECK_RESULT.includes(result)
    ) {
      await this.prisma.contact.update({
        where: { id: emailCheck.contactId },
        data: { bouncedAt: new Date(), bouncedBy: 'email_check' },
      });
    }
  }
}
