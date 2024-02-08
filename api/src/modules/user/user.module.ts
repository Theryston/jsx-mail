import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { CreateUserService } from './services/create-user.service';
import { CreateSessionService } from '../session/services/create-session.service';
import { PrismaService } from 'src/services/prisma.service';
import { CreateSecurityCodeService } from './services/create-security-code.service';
import { EmailModule } from '../email/email.module';
import { UseSecurityCodeService } from './services/use-security-code.service';
import { ValidateEmailService } from './services/validate-email.service';
import { AuthUserService } from './services/auth-user.service';
import { ResetPasswordService } from './services/reset-password.service';
import { AddBalanceService } from './services/add-balance.service';
import { GetBalanceService } from './services/get-balance.service';
import { GetFullBalanceService } from './services/get-full-balance.service';
import { ListTransactionsService } from './services/list-transactions.service';
import { CreateCheckoutService } from './services/create-checkout.service';
import { StripeService } from 'src/services/stripe.service';
import { HandleWebhookService } from './services/handle-webhook.service';

@Module({
  controllers: [UserController],
  providers: [StripeService, CreateUserService, PrismaService, CreateSessionService, CreateSecurityCodeService, UseSecurityCodeService, ValidateEmailService, AuthUserService, ResetPasswordService, AddBalanceService, GetBalanceService, GetFullBalanceService, ListTransactionsService, CreateCheckoutService, HandleWebhookService],
  imports: [EmailModule],
})
export class UserModule { }
