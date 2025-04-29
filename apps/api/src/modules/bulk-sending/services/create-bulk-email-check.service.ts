import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBulkEmailCheckDto } from '../bulk-sending.dto';
import { EstimatedBulkEmailCheckService } from './estimated-bulk-email-check.service';
import { GetBalanceService } from 'src/modules/user/services/get-balance.service';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class CreateBulkEmailCheckService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
    private readonly estimatedBulkEmailCheckService: EstimatedBulkEmailCheckService,
    private readonly getBalanceService: GetBalanceService,
    @InjectQueue('bulk-email-check')
    private readonly bulkEmailCheckQueue: Queue,
  ) {}

  async execute(
    { contactGroupId, level }: CreateBulkEmailCheckDto,
    userId: string,
  ) {
    const contactGroup = await this.prisma.client.contactGroup.findUnique({
      where: { id: contactGroupId },
    });

    if (!contactGroup) {
      throw new NotFoundException('Contact group not found');
    }

    const processingBulkEmailCheck =
      await this.prisma.client.bulkEmailCheck.findFirst({
        where: {
          contactGroupId,
          status: {
            in: ['processing', 'pending'],
          },
        },
      });

    if (processingBulkEmailCheck) {
      throw new BadRequestException(
        'Wait for the previous bulk email check to finish',
      );
    }

    const estimatedBulkEmailCheck =
      await this.estimatedBulkEmailCheckService.execute(
        {
          contactGroupId,
        },
        userId,
      );

    if (estimatedBulkEmailCheck.contactsCount === 0) {
      throw new BadRequestException('No contacts found in the contact group');
    }

    const balance = await this.getBalanceService.execute(userId);

    if (balance.amount < estimatedBulkEmailCheck.estimatedCost) {
      throw new BadRequestException(
        `Insufficient balance to create bulk email check. You need ${estimatedBulkEmailCheck.friendlyEstimatedCost} to check ${estimatedBulkEmailCheck.contactsCount} emails.`,
      );
    }

    const bulkEmailCheck = await this.prisma.client.bulkEmailCheck.create({
      data: {
        contactGroupId,
        userId,
        totalEmails: estimatedBulkEmailCheck.contactsCount,
        estimatedEndSeconds: estimatedBulkEmailCheck.estimatedTimeSeconds,
        estimatedEndAt: estimatedBulkEmailCheck.estimatedEndAt,
        level,
      },
    });

    this.bulkEmailCheckQueue.add('bulk-email-check', {
      bulkEmailCheckId: bulkEmailCheck.id,
    });

    return bulkEmailCheck;
  }
}
