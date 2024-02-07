import { Body, Controller, Post, Request, Delete, Get } from '@nestjs/common';
import { CreateSenderDto } from './sender.dto';
import { CreateSenderService } from './services/create-sender.service';
import { Permissions } from 'src/auth/permissions.decorator';
import { PERMISSIONS } from 'src/auth/permissions';
import { DeleteSenderService } from './services/delete-sender.service';
import { ListSendersService } from './services/list-senders.service';

@Controller('sender')
export class SenderController {
	constructor(private readonly createSenderService: CreateSenderService, private readonly deleteSenderService: DeleteSenderService, private readonly listSendersService: ListSendersService) { }

	@Post()
	@Permissions([PERMISSIONS.SELF_CREATE_SENDER.value])
	async create(@Body() data: CreateSenderDto, @Request() req) {
		return this.createSenderService.execute(data, req.user.id);
	}

	@Delete(':id')
	@Permissions([PERMISSIONS.SELF_DELETE_SENDER.value])
	async delete(@Request() req) {
		return this.deleteSenderService.execute(req.params.id, req.user.id);
	}

	@Get()
	@Permissions([PERMISSIONS.SELF_LIST_SENDERS.value])
	async list(@Request() req) {
		return this.listSendersService.execute(req.user.id);
	}
}
