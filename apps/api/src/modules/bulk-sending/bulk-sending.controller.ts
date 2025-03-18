import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { CreateContactsGroupService } from './services/create-contacts-group.service';
import {
  CreateBulkContactsDto,
  CreateContactGroupDto,
} from './bulk-sending.dto';
import { PERMISSIONS } from 'src/auth/permissions';
import { Permissions } from 'src/auth/permissions.decorator';
import { ListContactGroupsService } from './services/list-contact-groups.service';
import { DeleteContactGroupService } from './services/delete-contact-group.service';
import { GetContactGroupServiceService } from './services/get-contact-group-service.service';
import { ListContactsFromContactGroupService } from './services/list-contacts-from-contact-group.service';
import { DeleteContactGroupContactService } from './services/delete-contact-group-contact.service';
import { CreateBulkContactsService } from './services/create-bulk-contacts.service';
import { ListContactImportsService } from './services/list-contact-imports.service';

@Controller('bulk-sending')
export class BulkSendingController {
  constructor(
    private readonly createContactsGroupService: CreateContactsGroupService,
    private readonly listContactGroupsService: ListContactGroupsService,
    private readonly deleteContactGroupService: DeleteContactGroupService,
    private readonly getContactGroupService: GetContactGroupServiceService,
    private readonly listContactsFromContactGroupService: ListContactsFromContactGroupService,
    private readonly deleteContactGroupContactService: DeleteContactGroupContactService,
    private readonly createBulkContactsService: CreateBulkContactsService,
    private readonly listContactImportsService: ListContactImportsService,
  ) {}

  @Post('contact-group')
  @Permissions([PERMISSIONS.SELF_CREATE_CONTACT_GROUP.value])
  createContactGroup(@Body() body: CreateContactGroupDto, @Req() req) {
    return this.createContactsGroupService.execute(body, req.user.id);
  }

  @Get('contact-group')
  @Permissions([PERMISSIONS.SELF_LIST_CONTACT_GROUPS.value])
  listContactGroups(@Req() req, @Query() query: any) {
    return this.listContactGroupsService.execute(req.user.id, query);
  }

  @Delete('contact-group/:id')
  @Permissions([PERMISSIONS.SELF_DELETE_CONTACT_GROUP.value])
  deleteContactGroup(@Param('id') id: string, @Req() req) {
    return this.deleteContactGroupService.execute(id, req.user.id);
  }

  @Get('contact-group/:id')
  @Permissions([PERMISSIONS.SELF_GET_CONTACT_GROUP.value])
  getContactGroup(@Param('id') id: string, @Req() req) {
    return this.getContactGroupService.execute(id, req.user.id);
  }

  @Get('contact-group/:id/contacts')
  @Permissions([PERMISSIONS.SELF_GET_CONTACT_GROUP_CONTACTS.value])
  getContactGroupContacts(
    @Param('id') id: string,
    @Req() req,
    @Query() query: any,
  ) {
    return this.listContactsFromContactGroupService.execute(
      id,
      req.user.id,
      query,
    );
  }

  @Delete('contact-group/:id/contacts/:contactId')
  @Permissions([PERMISSIONS.SELF_DELETE_CONTACT_GROUP_CONTACTS.value])
  deleteContactGroupContact(
    @Param('id') id: string,
    @Param('contactId') contactId: string,
    @Req() req,
  ) {
    return this.deleteContactGroupContactService.execute(
      id,
      contactId,
      req.user.id,
    );
  }

  @Post('contact-group/:id/contacts')
  @Permissions([PERMISSIONS.SELF_CREATE_CONTACT_IMPORT.value])
  addContactGroupContacts(
    @Param('id') id: string,
    @Body() body: CreateBulkContactsDto,
    @Req() req,
  ) {
    return this.createBulkContactsService.execute(id, body, req.user.id);
  }

  @Get('contact-import')
  @Permissions([PERMISSIONS.SELF_GET_CONTACT_IMPORT.value])
  getContactImport(@Req() req) {
    return this.listContactImportsService.execute(req.user.id);
  }
}
