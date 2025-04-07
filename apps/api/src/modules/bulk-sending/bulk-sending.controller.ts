import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Delete,
  Param,
  Query,
  Put,
} from '@nestjs/common';
import { CreateContactsGroupService } from './services/create-contacts-group.service';
import {
  CreateBulkContactsDto,
  CreateBulkEmailCheckDto,
  CreateBulkSendingDto,
  CreateContactDto,
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
import { MarkContactImportsAsReadService } from './services/mark-contact-imports-as-read.service';
import { ListContactImportFailuresSService } from './services/list-contact-import-failures-s.service';
import { CreateBulkSendingService } from './services/create-bulk-sending.service';
import { ListBulkSendingsService } from './services/list-bulk-sendings.service';
import { ContactUnsubscribeService } from './services/contact-unsubscribe.service';
import { ContactExistsService } from './services/contact-exists.service';
import { ListBulkSendingFailuresService } from './services/list-bulk-sending-failures.service';
import { CreateContactService } from './services/create-contact.service';
import { CreateBulkEmailCheckService } from './services/create-bulk-email-check.service';
import { ListBulkEmailChecksService } from './services/list-bulk-email-checks.service';
import { EstimatedBulkEmailCheckService } from './services/estimated-bulk-email-check.service';
import { MarkBulkEmailCheckAsReadService } from './services/mark-bulk-email-check-as-read.service';
import { BulkEmailCheckWebhookService } from './services/bulk-email-check-webhook.service';

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
    private readonly markContactImportAsReadService: MarkContactImportsAsReadService,
    private readonly listContactImportFailuresService: ListContactImportFailuresSService,
    private readonly createBulkSendingService: CreateBulkSendingService,
    private readonly listBulkSendingsService: ListBulkSendingsService,
    private readonly contactUnsubscribeService: ContactUnsubscribeService,
    private readonly contactExistsService: ContactExistsService,
    private readonly listBulkSendingFailuresService: ListBulkSendingFailuresService,
    private readonly createContactService: CreateContactService,
    private readonly createBulkEmailCheckService: CreateBulkEmailCheckService,
    private readonly listBulkEmailChecksService: ListBulkEmailChecksService,
    private readonly estimateBulkEmailCheckService: EstimatedBulkEmailCheckService,
    private readonly markBulkEmailCheckAsReadService: MarkBulkEmailCheckAsReadService,
    private readonly bulkEmailCheckWebhookService: BulkEmailCheckWebhookService,
  ) {}

  @Post()
  @Permissions([
    PERMISSIONS.SELF_CREATE_BULK_SENDING.value,
    PERMISSIONS.SELF_SEND_EMAIL.value,
  ])
  createBulkSending(@Body() body: CreateBulkSendingDto, @Req() req) {
    return this.createBulkSendingService.execute(body, req.user.id);
  }

  @Get()
  @Permissions([PERMISSIONS.SELF_LIST_BULK_SENDINGS.value])
  listBulkSendings(@Req() req, @Query() query: any) {
    return this.listBulkSendingsService.execute(req.user.id, query);
  }

  @Get(':id/failures')
  @Permissions([PERMISSIONS.SELF_GET_BULK_SENDING_FAILURES.value])
  listBulkSendingFailures(
    @Param('id') id: string,
    @Req() req,
    @Query() query: any,
  ) {
    return this.listBulkSendingFailuresService.execute(id, req.user.id, query);
  }

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
  @Permissions([PERMISSIONS.SELF_CREATE_CONTACT_GROUP_CONTACTS.value])
  createContactGroupContacts(
    @Param('id') id: string,
    @Body() body: CreateContactDto,
    @Req() req,
  ) {
    return this.createContactService.execute(body, req.user.id, id);
  }

  @Post('contact-import/:id')
  @Permissions([PERMISSIONS.SELF_CREATE_CONTACT_IMPORT.value])
  addContactGroupContacts(
    @Param('id') id: string,
    @Body() body: CreateBulkContactsDto,
    @Req() req,
  ) {
    return this.createBulkContactsService.execute(id, body, req.user.id);
  }

  @Get('contact-import/:id')
  @Permissions([PERMISSIONS.SELF_GET_CONTACT_IMPORT.value])
  getContactImport(@Param('id') id: string, @Req() req) {
    return this.listContactImportsService.execute(id, req.user.id);
  }

  @Get('contact-import/:contactImportId/failures')
  @Permissions([PERMISSIONS.SELF_GET_CONTACT_IMPORT_FAILURES.value])
  getContactImportFailures(
    @Param('contactImportId') contactImportId: string,
    @Req() req,
    @Query() query: any,
  ) {
    return this.listContactImportFailuresService.execute(
      contactImportId,
      req.user.id,
      query,
    );
  }

  @Put('contact-import/:contactImportId/read')
  @Permissions([PERMISSIONS.SELF_MARK_CONTACT_IMPORT_AS_READ.value])
  readContactImport(
    @Param('contactImportId') contactImportId: string,
    @Req() req,
  ) {
    return this.markContactImportAsReadService.execute(
      contactImportId,
      req.user.id,
    );
  }

  @Post('unsubscribe/:key')
  unsubscribe(@Param('key') key: string) {
    return this.contactUnsubscribeService.execute(key);
  }

  @Get('unsubscribe/:key')
  unsubscribeExists(@Param('key') key: string) {
    return this.contactExistsService.execute(key);
  }

  @Post('email-check')
  @Permissions([PERMISSIONS.SELF_CREATE_BULK_EMAIL_CHECK.value])
  createBulkEmailCheck(@Body() body: CreateBulkEmailCheckDto, @Req() req) {
    return this.createBulkEmailCheckService.execute(body, req.user.id);
  }

  @Get('email-check/:contactGroupId')
  @Permissions([PERMISSIONS.SELF_LIST_BULK_EMAIL_CHECKS.value])
  listBulkEmailChecks(
    @Param('contactGroupId') contactGroupId: string,
    @Req() req,
  ) {
    return this.listBulkEmailChecksService.execute(
      { contactGroupId },
      req.user.id,
    );
  }

  @Get('email-check/estimate/:contactGroupId')
  @Permissions([PERMISSIONS.SELF_CREATE_BULK_EMAIL_CHECK_ESTIMATE.value])
  estimateBulkEmailCheck(
    @Param('contactGroupId') contactGroupId: string,
    @Req() req,
    @Query() query: any,
  ) {
    return this.estimateBulkEmailCheckService.execute(
      { contactGroupId },
      req.user.id,
      query.customEmailsTotal ? Number(query.customEmailsTotal) : undefined,
    );
  }

  @Put('email-check/:bulkEmailCheckId/read')
  @Permissions([PERMISSIONS.SELF_MARK_BULK_EMAIL_CHECK_AS_READ.value])
  readBulkEmailCheck(
    @Param('bulkEmailCheckId') bulkEmailCheckId: string,
    @Req() req,
  ) {
    return this.markBulkEmailCheckAsReadService.execute(
      bulkEmailCheckId,
      req.user.id,
    );
  }

  @Post('bulk-email-check/webhook/:bulkEmailCheckBatchId')
  bulkEmailCheckWebhook(
    @Param('bulkEmailCheckBatchId') bulkEmailCheckBatchId: string,
    @Body() body: any,
  ) {
    console.log(body);
    return this.bulkEmailCheckWebhookService.execute(bulkEmailCheckBatchId);
  }
}
