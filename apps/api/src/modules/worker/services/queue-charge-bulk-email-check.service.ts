import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class QueueChargeBulkEmailCheckService {
  constructor(@InjectQueue('worker') private readonly queue: Queue) {}

  async add(userId: string) {
    await this.queue.add('charge-email-check', { userId });
  }
}
