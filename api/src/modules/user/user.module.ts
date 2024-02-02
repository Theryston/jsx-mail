import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { CreateUserService } from './services/create-user.service';
import { CreateSessionService } from './services/create-session.service';
import { PrismaService } from 'src/services/prisma.service';
import { CreateSecurityCodeService } from './services/create-security-code.service';
import { EmailModule } from '../email/email.module';
import { UseSecurityCodeService } from './services/use-security-code.service';
import { ValidateEmailService } from './services/validate-email.service';
import { AuthUserService } from './services/auth-user.service';
import { ResetPasswordService } from './services/reset-password.service';

@Module({
  controllers: [UserController],
  providers: [CreateUserService, PrismaService, CreateSessionService, CreateSecurityCodeService, UseSecurityCodeService, ValidateEmailService, AuthUserService, ResetPasswordService],
  imports: [EmailModule],
})
export class UserModule { }