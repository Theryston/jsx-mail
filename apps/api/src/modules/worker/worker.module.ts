import { Module } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { StorageSizeService } from './services/storage-size.service';
import { ChargeService } from './services/charge.service';
import { WorkerController } from './worker.controller';
import { UpdateChargeMonthService } from './services/update-charge-month.service';
import { UserModule } from '../user/user.module';
import { DeadMessagesService } from './services/dead-messages.service';
import { ResendProcessingMessagesService } from './services/resend-processing-messages.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [UserModule, EmailModule],
  providers: [
    PrismaService,
    StorageSizeService,
    ChargeService,
    UpdateChargeMonthService,
    DeadMessagesService,
    ResendProcessingMessagesService,
  ],
  controllers: [WorkerController],
})
export class WorkerModule {}
