import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { CreateBulkEmailCheckDto } from '../bulk-sending.dto';
import { EstimatedBulkEmailCheckService } from './estimated-bulk-email-check.service';
import { GetBalanceService } from 'src/modules/user/services/get-balance.service';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class CreateBulkEmailCheckService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly estimatedBulkEmailCheckService: EstimatedBulkEmailCheckService,
    private readonly getBalanceService: GetBalanceService,
    @InjectQueue('bulk-email-check')
    private readonly bulkEmailCheckQueue: Queue,
  ) {}

  async execute({ contactGroupId }: CreateBulkEmailCheckDto, userId: string) {
    const contactGroup = await this.prisma.contactGroup.findUnique({
      where: { id: contactGroupId },
    });

    if (!contactGroup) {
      throw new NotFoundException('Contact group not found');
    }

    const estimatedBulkEmailCheck =
      await this.estimatedBulkEmailCheckService.execute(
        {
          contactGroupId,
        },
        userId,
      );

    const balance = await this.getBalanceService.execute(userId);

    if (balance.amount < estimatedBulkEmailCheck.estimatedCost) {
      throw new BadRequestException(
        `Insufficient balance to create bulk email check. You need ${estimatedBulkEmailCheck.friendlyEstimatedCost} to check ${estimatedBulkEmailCheck.contactsCount} emails.`,
      );
    }

    const bulkEmailCheck = await this.prisma.bulkEmailCheck.create({
      data: {
        contactGroupId,
        userId,
        totalEmails: estimatedBulkEmailCheck.contactsCount,
      },
    });

    this.bulkEmailCheckQueue.add('bulk-email-check', {
      bulkEmailCheckId: bulkEmailCheck.id,
    });

    return bulkEmailCheck;
  }
}
