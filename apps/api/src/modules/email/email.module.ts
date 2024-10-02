import { Module } from '@nestjs/common';
import { SendEmailService } from './services/send-email.service';
import { BullModule } from '@nestjs/bullmq';
import { EmailProcessor } from './email.processor';
import { PrismaService } from 'src/services/prisma.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  providers: [PrismaService, SendEmailService, EmailProcessor],
  exports: [SendEmailService],
})
export class EmailModule {}
