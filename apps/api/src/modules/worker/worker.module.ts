import { Module } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { StorageSizeService } from './services/storage-size.service';
import { ChargeService } from './services/charge.service';
import { WorkerController } from './worker.controller';
import { UpdateChargeMonthService } from './services/update-charge-month.service';
import { UserModule } from '../user/user.module';
import { DeadMessagesService } from './services/dead-messages.service';

@Module({
  imports: [UserModule],
  providers: [
    PrismaService,
    StorageSizeService,
    ChargeService,
    UpdateChargeMonthService,
    DeadMessagesService,
  ],
  controllers: [WorkerController],
})
export class WorkerModule {}
