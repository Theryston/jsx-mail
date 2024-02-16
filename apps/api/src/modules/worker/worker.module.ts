import { Module } from '@nestjs/common';
import { AddFreeBalanceService } from './services/add-free-balance.service';
import { PrismaService } from 'src/services/prisma.service';
import { StorageSizeService } from './services/storage-size.service';
import { ChargeService } from './services/charge.service';

@Module({
	providers: [AddFreeBalanceService, PrismaService, StorageSizeService, ChargeService]
})
export class WorkerModule { }
