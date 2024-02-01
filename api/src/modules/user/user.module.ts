import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { CreateUserService } from './services/create-user.service';
import { CreateSessionService } from './services/create-session.service';
import { PrismaService } from 'src/services/prisma.service';
import { RequestEmailCodeService } from './services/request-email-code.service';
import { EmailModule } from '../email/email.module';
import { ValidateEmailService } from './services/validate-email.service';

@Module({
  controllers: [UserController],
  providers: [CreateUserService, PrismaService, CreateSessionService, RequestEmailCodeService, ValidateEmailService],
  imports: [EmailModule],
})
export class UserModule { }
