import { Module } from '@nestjs/common';
import { AddFreeBalanceService } from './services/add-free-balance.service';
import { PrismaService } from 'src/services/prisma.service';
import { StorageSizeService } from './services/storage-size.service';
import { ChargeService } from './services/charge.service';
import { ImportFileDownloadsService } from './services/import-file-downloads.service';

@Module({
	providers: [AddFreeBalanceService, PrismaService, StorageSizeService, ChargeService, ImportFileDownloadsService]
})
export class WorkerModule { }
