import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Delete,
  Param,
} from '@nestjs/common';
import { CreateContactsGroupService } from './services/create-contacts-group.service';
import { CreateContactGroupDto } from './bulk-sending.dto';
import { PERMISSIONS } from 'src/auth/permissions';
import { Permissions } from 'src/auth/permissions.decorator';
import { ListContactGroupsService } from './services/list-contact-groups.service';
import { DeleteContactGroupService } from './services/delete-contact-group.service';

@Controller('bulk-sending')
export class BulkSendingController {
  constructor(
    private readonly createContactsGroupService: CreateContactsGroupService,
    private readonly listContactGroupsService: ListContactGroupsService,
    private readonly deleteContactGroupService: DeleteContactGroupService,
  ) {}

  @Post('contact-group')
  @Permissions([PERMISSIONS.SELF_CREATE_CONTACT_GROUP.value])
  createContactGroup(@Body() body: CreateContactGroupDto, @Req() req) {
    return this.createContactsGroupService.execute(body, req.user.id);
  }

  @Get('contact-group')
  @Permissions([PERMISSIONS.SELF_LIST_CONTACT_GROUPS.value])
  listContactGroups(@Req() req) {
    return this.listContactGroupsService.execute(req.user.id);
  }

  @Delete('contact-group/:id')
  @Permissions([PERMISSIONS.SELF_DELETE_CONTACT_GROUP.value])
  deleteContactGroup(@Param('id') id: string, @Req() req) {
    return this.deleteContactGroupService.execute(id, req.user.id);
  }
}
