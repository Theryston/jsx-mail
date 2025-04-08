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
import { BulkEmailCheckProcessor } from './bulk-email-check.processor';
import { CreateBulkEmailCheckService } from './services/create-bulk-email-check.service';
import { ListBulkEmailChecksService } from './services/list-bulk-email-checks.service';
import { EstimatedBulkEmailCheckService } from './services/estimated-bulk-email-check.service';
import { WorkerModule } from '../worker/worker.module';
import { MarkBulkEmailCheckAsReadService } from './services/mark-bulk-email-check-as-read.service';
import { EmailModule } from '../email/email.module';
import { CreateEmailCheckService } from './services/create-email-check.service';
import { BulkEmailCheckWebhookService } from './services/bulk-email-check-webhook.service';
import { GetBulkCheckResultProcessor } from './get-bulk-check-result.processor';

@Module({
  imports: [
    UserModule,
    BullModule.registerQueue({
      name: 'bulk-sending',
    }),
    BullModule.registerQueue({
      name: 'bulk-email-check',
    }),
    BullModule.registerQueue({
      name: 'get-bulk-check-result',
    }),
    SenderModule,
    WorkerModule,
    EmailModule,
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
    BulkEmailCheckProcessor,
    CreateBulkEmailCheckService,
    ListBulkEmailChecksService,
    EstimatedBulkEmailCheckService,
    MarkBulkEmailCheckAsReadService,
    CreateEmailCheckService,
    BulkEmailCheckWebhookService,
    GetBulkCheckResultProcessor,
  ],
})
export class BulkSendingModule {}
