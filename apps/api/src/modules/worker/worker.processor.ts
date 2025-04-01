import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { ChargeService } from './services/charge.service';
import { StorageSizeService } from './services/storage-size.service';
import { UpdateChargeMonthService } from './services/update-charge-month.service';
import { DeadMessagesService } from './services/dead-messages.service';
import { ResendProcessingMessagesService } from './services/resend-processing-messages.service';
import moment from 'moment';

@Injectable()
@Processor('worker')
export class WorkerProcessor extends WorkerHost {
  constructor(
    private readonly chargeService: ChargeService,
    private readonly storageSizeService: StorageSizeService,
    private readonly updateChargeMonthService: UpdateChargeMonthService,
    private readonly deadMessagesService: DeadMessagesService,
    private readonly resendProcessingMessagesService: ResendProcessingMessagesService,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    const start = moment();
    console.log(
      `[WORKER] ${job.name} started at ${start.format('YYYY-MM-DD HH:mm:ss')}`,
    );

    const result = await this.run(job);

    const end = moment();

    console.log(
      `[WORKER] ${job.name} finished with result: ${JSON.stringify(result)} in ${end.diff(start, 'seconds')}s`,
    );

    const duration = end.diff(start, 'seconds');

    console.log(
      `[WORKER] ${job.name} finished with result: ${JSON.stringify(result)} in ${duration}s`,
    );
  }

  async run(job: Job): Promise<any> {
    const { name } = job;

    switch (name) {
      case 'charge':
        return this.chargeService.execute();
      case 'storage-size':
        return this.storageSizeService.execute();
      case 'update-charge-month':
        return this.updateChargeMonthService.execute();
      case 'dead-messages':
        return this.deadMessagesService.execute();
      case 'resend-processing-messages':
        return this.resendProcessingMessagesService.execute();
      default:
        throw new Error(`Job ${name} not implemented`);
    }
  }
}
