import { Module } from '@nestjs/common';
import { StorageSizeService } from './services/storage-size.service';
import { ChargeService } from './services/charge.service';
import { WorkerController } from './worker.controller';
import { UpdateChargeMonthService } from './services/update-charge-month.service';
import { UserModule } from '../user/user.module';
import { DeadMessagesService } from './services/dead-messages.service';
import { ResendProcessingMessagesService } from './services/resend-processing-messages.service';
import { EmailModule } from '../email/email.module';
import { BullModule } from '@nestjs/bullmq';
import { WorkerProcessor } from './worker.processor';
import { ChargeBulkEmailCheckService } from './services/charge-bulk-email-check.service';
import { QueueChargeBulkEmailCheckService } from './services/queue-charge-bulk-email-check.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'worker',
    }),
    UserModule,
    EmailModule,
  ],
  providers: [
    StorageSizeService,
    ChargeService,
    UpdateChargeMonthService,
    DeadMessagesService,
    ResendProcessingMessagesService,
    WorkerProcessor,
    ChargeBulkEmailCheckService,
    QueueChargeBulkEmailCheckService,
  ],
  controllers: [WorkerController],
  exports: [QueueChargeBulkEmailCheckService],
})
export class WorkerModule {}
