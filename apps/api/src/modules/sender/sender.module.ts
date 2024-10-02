import { Module } from '@nestjs/common';
import { SenderController } from './sender.controller';
import { CreateSenderService } from './services/create-sender.service';
import { PrismaService } from 'src/services/prisma.service';
import { DeleteSenderService } from './services/delete-sender.service';
import { ListSendersService } from './services/list-senders.service';
import { SenderSendEmailService } from './services/sender-send-email.service';
import { GetBalanceService } from '../user/services/get-balance.service';
import { SendEmailService } from '../email/services/send-email.service';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  controllers: [SenderController],
  providers: [
    CreateSenderService,
    PrismaService,
    DeleteSenderService,
    ListSendersService,
    SenderSendEmailService,
    GetBalanceService,
    SendEmailService,
  ],
})
export class SenderModule {}
