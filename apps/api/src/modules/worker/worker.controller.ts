import { Controller, Post } from '@nestjs/common';
import { AddFreeBalanceService } from './services/add-free-balance.service';
import { Permissions } from 'src/auth/permissions.decorator';
import { PERMISSIONS } from 'src/auth/permissions';
import { ChargeService } from './services/charge.service';
import { StorageSizeService } from './services/storage-size.service';

@Controller('worker')
export class WorkerController {
	constructor(
		private readonly addFreeBalanceService: AddFreeBalanceService,
		private readonly chargeService: ChargeService,
		private readonly storageSizeService: StorageSizeService
	) { }

	@Post('add-free-balance')
	@Permissions([PERMISSIONS.OTHER_RUN_WORKERS.value])
	addFreeBalance() {
		return this.addFreeBalanceService.execute();
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
}
