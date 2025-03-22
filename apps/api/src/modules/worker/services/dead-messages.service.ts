import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class DeadMessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async execute() {
    console.log(`[DEAD_MESSAGES] started at: ${new Date()}`);

    const oneDayAgo = moment().subtract(1, 'day').toDate();

    const messages = await this.prisma.message.findMany({
      where: {
        status: {
          in: ['queued', 'processing'],
        },
        createdAt: {
          lt: oneDayAgo,
        },
      },
    });

    console.log(
      `[DEAD_MESSAGES] found ${messages.length} messages created before ${oneDayAgo} and still in processing or queued`,
    );

    for (const message of messages) {
      await this.prisma.message.update({
        where: { id: message.id },
        data: {
          status: 'failed',
        },
      });

      console.log(`[DEAD_MESSAGES] updated message ${message.id} to failed`);
    }

    console.log(`[DEAD_MESSAGES] finished at: ${new Date()}`);
  }
}
