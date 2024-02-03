import { Controller, Delete, Req } from '@nestjs/common';
import { PERMISSIONS } from 'src/auth/permissions';
import { Permissions } from 'src/auth/permissions.decorator';
import { DeleteSessionService } from './services/delete-session.service';

@Controller('session')
export class SessionController {
	constructor(private readonly deleteSessionService: DeleteSessionService) { }

	@Delete()
	@Permissions([PERMISSIONS.SELF_SESSION_DELETE.value])
	deleteSession(@Req() request: any) {
		return this.deleteSessionService.execute(
			{ sessionId: request.session.id }
		)
	}
}
