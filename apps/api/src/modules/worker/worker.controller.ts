import { Controller, Post } from '@nestjs/common';
import { Permissions } from 'src/auth/permissions.decorator';
import { PERMISSIONS } from 'src/auth/permissions';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Controller('worker')
export class WorkerController {
  constructor(@InjectQueue('worker') private readonly workerQueue: Queue) {}

  @Post('update-charge-month')
  @Permissions([PERMISSIONS.OTHER_RUN_WORKERS.value])
  async updateChargeMonth() {
    await this.workerQueue.add('update-charge-month', {});

    return {
      message: 'Update charge month job added to queue',
    };
  }

  @Post('charge')
  @Permissions([PERMISSIONS.OTHER_RUN_WORKERS.value])
  async charge() {
    await this.workerQueue.add('charge', {});

    return {
      message: 'Charge job added to queue',
    };
  }

  @Post('storage-size')
  @Permissions([PERMISSIONS.OTHER_RUN_WORKERS.value])
  async storageSize() {
    await this.workerQueue.add('storage-size', {});

    return {
      message: 'Storage size job added to queue',
    };
  }

  @Post('dead-messages')
  @Permissions([PERMISSIONS.OTHER_RUN_WORKERS.value])
  async deadMessages() {
    await this.workerQueue.add('dead-messages', {});

    return {
      message: 'Dead messages job added to queue',
    };
  }

  @Post('resend-processing-messages')
  @Permissions([PERMISSIONS.OTHER_RUN_WORKERS.value])
  async resendProcessingMessages() {
    await this.workerQueue.add('resend-processing-messages', {});

    return {
      message: 'Resend processing messages job added to queue',
    };
  }
}
