import {
  Controller,
  Delete,
  Req,
  Query,
  Get,
  Post,
  Body,
} from '@nestjs/common';
import { PERMISSIONS } from 'src/auth/permissions';
import { Permissions } from 'src/auth/permissions.decorator';
import { DeleteSessionService } from './services/delete-session.service';
import { CreateSessionService } from './services/create-session.service';
import { CreateSessionDto } from './session.dto';
import { ListSessionsService } from './services/list-sessions.service';

@Controller('session')
export class SessionController {
  constructor(
    private readonly deleteSessionService: DeleteSessionService,
    private readonly createSessionService: CreateSessionService,
    private readonly listSessionsService: ListSessionsService,
  ) {}

  @Delete()
  @Permissions([PERMISSIONS.SELF_SESSION_DELETE.value])
  deleteSession(@Req() request: any, @Query() query: any) {
    return this.deleteSessionService.execute({
      sessionId: query.id || request.session.id,
    });
  }

  @Get()
  @Permissions([PERMISSIONS.SELF_LIST_SESSIONS.value])
  listSessions(@Req() request: any) {
    return this.listSessionsService.execute(request.user.id);
  }

  @Get('permissions')
  getAllPermissions(@Req() request: any) {
    const permissions = Object.keys(PERMISSIONS)
      .map((key) => PERMISSIONS[key])
      .filter((permission) => !permission.ignoreList);

    if (request.user && request.user.accessLevel === 'other') {
      return permissions;
    }

    return permissions.filter((permission) =>
      permission.value.startsWith('self:'),
    );
  }

  @Post()
  @Permissions([PERMISSIONS.SELF_SESSION_CREATE.value])
  createSession(@Body() body: CreateSessionDto, @Req() request: any) {
    return this.createSessionService.execute({
      ...body,
      userId: request.user.id,
    });
  }
}
