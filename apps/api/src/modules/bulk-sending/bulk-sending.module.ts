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
import { CreateContactService } from './services/create-contact.service';
import { UserModule } from '../user/user.module';
import { EmailCheckProcessor } from './email-check.processor';
import { BulkEmailCheckProcessor } from './bulk-email-check.processor';
import { CreateBulkEmailCheckService } from './services/create-bulk-email-check.service';
import { ListBulkEmailChecksService } from './services/list-bulk-email-checks.service';
import { EstimatedBulkEmailCheckService } from './services/estimated-bulk-email-check.service';
import { WorkerModule } from '../worker/worker.module';

@Module({
  imports: [
    UserModule,
    BullModule.registerQueue({
      name: 'bulk-sending',
    }),
    BullModule.registerQueue({
      name: 'email-check',
    }),
    BullModule.registerQueue({
      name: 'bulk-email-check',
    }),
    SenderModule,
    WorkerModule,
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
    CreateContactService,
    EmailCheckProcessor,
    BulkEmailCheckProcessor,
    CreateBulkEmailCheckService,
    ListBulkEmailChecksService,
    EstimatedBulkEmailCheckService,
  ],
})
export class BulkSendingModule {}
