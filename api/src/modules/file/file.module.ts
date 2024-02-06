import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { UploadFileService } from './services/upload-file.service';
import { PrismaService } from 'src/services/prisma.service';
import { DeleteFileService } from './services/delete-file.service';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ListFilesService } from './services/list-files.service';
import { GetBalanceService } from '../user/services/get-balance.service';
import { DownloadFileService } from './services/download-file.service';

@Module({
  controllers: [FileController],
  providers: [UploadFileService, PrismaService, DeleteFileService, ListFilesService, GetBalanceService, DownloadFileService],
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
    })
  ]
})
export class FileModule { }
