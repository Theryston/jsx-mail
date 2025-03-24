import { Controller, Post } from '@nestjs/common';
import { Permissions } from 'src/auth/permissions.decorator';
import { PERMISSIONS } from 'src/auth/permissions';
import { ChargeService } from './services/charge.service';
import { StorageSizeService } from './services/storage-size.service';
import { UpdateChargeMonthService } from './services/update-charge-month.service';
import { DeadMessagesService } from './services/dead-messages.service';
import { ResendProcessingMessagesService } from './services/resend-processing-messages.service';

@Controller('worker')
export class WorkerController {
  constructor(
    private readonly chargeService: ChargeService,
    private readonly storageSizeService: StorageSizeService,
    private readonly updateChargeMonthService: UpdateChargeMonthService,
    private readonly deadMessagesService: DeadMessagesService,
    private readonly resendProcessingMessagesService: ResendProcessingMessagesService,
  ) {}

  @Post('update-charge-month')
  @Permissions([PERMISSIONS.OTHER_RUN_WORKERS.value])
  updateChargeMonth() {
    return this.updateChargeMonthService.execute();
  }

  @Post('charge')
  @Permissions([PERMISSIONS.OTHER_RUN_WORKERS.value])
  charge() {
    return this.chargeService.execute();
  }

  @Post('storage-size')
  @Permissions([PERMISSIONS.OTHER_RUN_WORKERS.value])
  storageSize() {
    return this.storageSizeService.execute();
  }

  @Post('dead-messages')
  @Permissions([PERMISSIONS.OTHER_RUN_WORKERS.value])
  deadMessages() {
    return this.deadMessagesService.execute();
  }

  @Post('resend-processing-messages')
  @Permissions([PERMISSIONS.OTHER_RUN_WORKERS.value])
  resendProcessingMessages() {
    return this.resendProcessingMessagesService.execute();
  }
}
