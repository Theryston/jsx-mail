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

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'contacts',
    }),
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
  ],
})
export class BulkSendingModule {}
