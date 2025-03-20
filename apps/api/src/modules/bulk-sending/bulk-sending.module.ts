import { Module } from '@nestjs/common';
import { BulkSendingController } from './bulk-sending.controller';
import { CreateContactsGroupService } from './services/create-contacts-group.service';
import { PrismaService } from 'src/services/prisma.service';
import { ListContactGroupsService } from './services/list-contact-groups.service';
import { DeleteContactGroupService } from './services/delete-contact-group.service';
import { GetContactGroupServiceService } from './services/get-contact-group-service.service';
import { ListContactsFromContactGroupService } from './services/list-contacts-from-contact-group.service';
import { DeleteContactGroupContactService } from './services/delete-contact-group-contact.service';
import { CreateBulkContactsService } from './services/create-bulk-contacts.service';
import { BullModule } from '@nestjs/bullmq';
import { BulkSendingProcessor } from './bulk-sending.processor';
import { ListContactImportsService } from './services/list-contact-imports.service';
import { MarkContactImportsAsReadService } from './services/mark-contact-imports-as-read.service';
import { ListContactImportFailuresSService } from './services/list-contact-import-failures-s.service';
import { CreateBulkSendingService } from './services/create-bulk-sending.service';
import { ListBulkSendingsService } from './services/list-bulk-sendings.service';
import { SenderModule } from '../sender/sender.module';
import { ContactUnsubscribeService } from './services/contact-unsubscribe.service';
import { ContactExistsService } from './services/contact-exists.service';
import { ListBulkSendingFailuresService } from './services/list-bulk-sending-failures.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'bulk-sending',
    }),
    SenderModule,
  ],
  controllers: [BulkSendingController],
  providers: [
    CreateContactsGroupService,
    PrismaService,
    ListContactGroupsService,
    DeleteContactGroupService,
    GetContactGroupServiceService,
    ListContactsFromContactGroupService,
    DeleteContactGroupContactService,
    CreateBulkContactsService,
    BulkSendingProcessor,
    ListContactImportsService,
    MarkContactImportsAsReadService,
    ListContactImportFailuresSService,
    CreateBulkSendingService,
    ListBulkSendingsService,
    ContactUnsubscribeService,
    ContactExistsService,
    ListBulkSendingFailuresService,
  ],
})
export class BulkSendingModule {}
