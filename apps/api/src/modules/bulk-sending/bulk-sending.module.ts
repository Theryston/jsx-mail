import { Module } from '@nestjs/common';
import { BulkSendingController } from './bulk-sending.controller';
import { CreateContactsGroupService } from './services/create-contacts-group.service';
import { PrismaService } from 'src/services/prisma.service';
import { ListContactGroupsService } from './services/list-contact-groups.service';
import { DeleteContactGroupService } from './services/delete-contact-group.service';

@Module({
  controllers: [BulkSendingController],
  providers: [CreateContactsGroupService, PrismaService, ListContactGroupsService, DeleteContactGroupService],
})
export class BulkSendingModule {}
