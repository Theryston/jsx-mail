import { Controller, Post, UseInterceptors, Req, Delete, Param, Get, Query, Response } from '@nestjs/common';
import { Response as Res } from 'express';
import { PERMISSIONS } from 'src/auth/permissions';
import { Permissions } from 'src/auth/permissions.decorator';
import { UploadFileService } from './services/upload-file.service';
import { DeleteFileService } from './services/delete-file.service';
import { FileInterceptor } from 'src/interceptors/file.interceptor';
import { ListFilesService } from './services/list-files.service';
import { DownloadFileService } from './services/download-file.service';


@Controller('file')
export class FileController {
	constructor(private readonly uploadFileService: UploadFileService, private readonly deleteFileService: DeleteFileService, private readonly listFilesService: ListFilesService, private readonly downloadFileService: DownloadFileService) { }

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

	@Get()
	@Permissions([PERMISSIONS.SELF_LIST_FILES.value])
	listFiles(@Req() req, @Query() data: any) {
		return this.listFilesService.execute({
			take: Number(data.take) || 10,
			page: Number(data.page) || 1
		}, req.user.id);
	}

	@Get('/*')
	async downloadFile(@Param() params, @Response() res: Res) {
		const key = params[0];
		const result = await this.downloadFileService.execute(key);
		return res.setHeader('Content-Type', result.mimeType).set('Content-Disposition', `attachment; filename="${result.filename}"`).send(result.buffer);
	}
}
