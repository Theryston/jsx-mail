import { Module } from '@nestjs/common';
import { SenderController } from './sender.controller';
import { CreateSenderService } from './services/create-sender.service';
import { PrismaService } from 'src/services/prisma.service';
import { DeleteSenderService } from './services/delete-sender.service';
import { ListSendersService } from './services/list-senders.service';

@Module({
  controllers: [SenderController],
  providers: [CreateSenderService, PrismaService, DeleteSenderService, ListSendersService]
})
export class SenderModule { }
