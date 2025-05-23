import { Inject, Injectable } from '@nestjs/common';
import moment from 'moment';
import { UpdateMessageStatusService } from 'src/modules/email/services/update-message-status.service';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class DeadMessagesService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
    private readonly updateMessageStatusService: UpdateMessageStatusService,
  ) {}

  async execute() {
    console.log(`[DEAD_MESSAGES] started at: ${new Date()}`);

    const thirtyDaysAgo = moment().subtract(30, 'days').toDate();

    const messages = await this.prisma.client.message.findMany({
      where: {
        status: {
          in: ['queued', 'processing'],
        },
        createdAt: {
          lt: thirtyDaysAgo,
        },
      },
    });

    console.log(
      `[DEAD_MESSAGES] found ${messages.length} messages created before ${thirtyDaysAgo} and still in processing or queued`,
    );

    const failedMessages = [];

    for (const message of messages) {
      await this.updateMessageStatusService.execute(
        message.id,
        'failed',
        'Failed because message was created before 30 days ago and still in processing or queued',
      );

      failedMessages.push(message.id);

      console.log(`[DEAD_MESSAGES] updated message ${message.id} to failed`);
    }

    console.log(`[DEAD_MESSAGES] finished at: ${new Date()}`);

    return {
      failedMessages,
    };
  }
}
