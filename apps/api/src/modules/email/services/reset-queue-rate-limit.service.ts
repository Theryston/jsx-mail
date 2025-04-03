import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class ResetQueueRateLimitService {
  constructor(@InjectQueue('email') private readonly emailQueue: Queue) {}

  async execute() {
    await this.emailQueue.removeRateLimitKey();
  }
}
