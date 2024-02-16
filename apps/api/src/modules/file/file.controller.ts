import {
  Controller,
  Post,
  Req,
  Delete,
  Param,
  Get,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PERMISSIONS } from 'src/auth/permissions';
import { Permissions } from 'src/auth/permissions.decorator';
import { UploadFileService } from './services/upload-file.service';
import { DeleteFileService } from './services/delete-file.service';
import { ListFilesService } from './services/list-files.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('file')
export class FileController {
  constructor(
    private readonly uploadFileService: UploadFileService,
    private readonly deleteFileService: DeleteFileService,
    private readonly listFilesService: ListFilesService,
  ) {}

  @Post()
  @Permissions([PERMISSIONS.SELF_FILE_UPLOAD.value])
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@Req() req, @UploadedFile() file: Express.Multer.File) {
    return this.uploadFileService.execute(file, req.user.id);
  }

  @Delete(':id')
  @Permissions([PERMISSIONS.SELF_FILE_DELETE.value])
  deleteFile(@Param('id') id: string, @Req() req) {
    return this.deleteFileService.execute(id, req.user.id);
  }

  @Get()
  @Permissions([PERMISSIONS.SELF_LIST_FILES.value])
  listFiles(@Req() req, @Query() data: any) {
    return this.listFilesService.execute(
      {
        take: Number(data.take) || 10,
        page: Number(data.page) || 1,
      },
      req.user.id,
    );
  }
}
