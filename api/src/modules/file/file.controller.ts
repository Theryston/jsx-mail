import { Controller, Post, UseInterceptors, UploadedFile, Req, Delete, Param } from '@nestjs/common';
import { PERMISSIONS } from 'src/auth/permissions';
import { Permissions } from 'src/auth/permissions.decorator';
import { UploadFileService } from './services/upload-file.service';
import { DeleteFileService } from './services/delete-file.service';
import { FileInterceptor } from 'src/interceptors/file.interceptor';


@Controller('file')
export class FileController {
	constructor(private readonly uploadFileService: UploadFileService, private readonly deleteFileService: DeleteFileService) { }

	@Post()
	@Permissions([PERMISSIONS.SELF_FILE_UPLOAD.value])
	@UseInterceptors(FileInterceptor)
	uploadFile(@Req() req) {
		return this.uploadFileService.execute(req.file, req.user.id);
	}

	@Delete(':id')
	@Permissions([PERMISSIONS.SELF_FILE_DELETE.value])
	deleteFile(@Param('id') id: string, @Req() req) {
		return this.deleteFileService.execute(id, req.user.id);
	}
}
