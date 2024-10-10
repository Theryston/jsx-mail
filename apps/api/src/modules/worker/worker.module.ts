import { Module } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { StorageSizeService } from './services/storage-size.service';
import { ChargeService } from './services/charge.service';
import { WorkerController } from './worker.controller';

@Module({
  providers: [PrismaService, StorageSizeService, ChargeService],
  controllers: [WorkerController],
})
export class WorkerModule {}
