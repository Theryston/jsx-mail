import { Module } from '@nestjs/common';
import { SenderController } from './sender.controller';
import { CreateSenderService } from './services/create-sender.service';
import { PrismaService } from 'src/services/prisma.service';
import { DeleteSenderService } from './services/delete-sender.service';
import { ListSendersService } from './services/list-senders.service';
import { SenderSendEmailService } from './services/sender-send-email.service';
import { GetBalanceService } from '../user/services/get-balance.service';
import { BullModule } from '@nestjs/bullmq';
import { UserModule } from '../user/user.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email',
    }),
    UserModule,
    EmailModule,
  ],
  controllers: [SenderController],
  providers: [
    CreateSenderService,
    PrismaService,
    DeleteSenderService,
    ListSendersService,
    SenderSendEmailService,
    GetBalanceService,
  ],
  exports: [SenderSendEmailService],
})
export class SenderModule {}
