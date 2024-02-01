import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { CreateUserService } from './services/create-user.service';
import { CreateSessionService } from './services/create-session.service';
import { PrismaService } from 'src/services/prisma.service';
import { CreateSecurityCodeService } from './services/create-security-code.service';
import { EmailModule } from '../email/email.module';
import { UseSecurityCodeService } from './services/use-security-code.service';

@Module({
  controllers: [UserController],
  providers: [CreateUserService, PrismaService, CreateSessionService, CreateSecurityCodeService, UseSecurityCodeService],
  imports: [EmailModule],
})
export class UserModule { }
