import { Module, forwardRef } from '@nestjs/common';
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
import { ExchangeMoneyService } from './services/exchange-money.service';
import { GetInsightsService } from './services/get-insights.service';
import { SessionModule } from '../session/session.module';
import { UpdateUserService } from './services/update-user.service';
import { ListMessagesService } from './services/list-messages.service';
import { MessagesInsightsService } from './services/messages-insights.service';
import { UpdateOnboardingStepService } from './services/update-onboarding-step.service';
import { BetaPermissionCheckService } from './services/beta-permission-check.service';
import { GetUsersService } from './services/get-users.service';
import { ImpersonateUserService } from './services/impersonate-user.service';
import { GetUserLimitsService } from './services/get-user-limits.service';
import { BlockPermissionService } from './services/block-permission.service';
import { VerifyTurnstileService } from './services/verify-turnstile.service';
import { GetMessageService } from './services/get-message.service';
import { GetSettingsService } from './services/get-settings.service';
import { UpdateDefaultSettingsService } from './services/update-default-settings.service';
import { UpdateUserSettingsService } from './services/update-user-settings.service';
import { DeleteUserSettingsService } from './services/delete-user-settings.service';
import { CreateUtmOrViewService } from './services/create-utm-or-view.service';
import { CheckEmailService } from './services/check-email.service';
import { CreateLeadService } from './services/create-lead.service';
import { ForceSendMessageWebhookService } from './services/force-send-message-webhook.service';
import { CreateUserWebhookService } from './services/create-user-webhook.service';
import { DeleteUserWebhookService } from './services/delete-user-webhook.service';
import { ListUserWebhookService } from './services/list-user-webhook.service';
import { ExportMessagesService } from './services/export-messages.service';
import { UserProcessor } from './user.processor';
import { BullModule } from '@nestjs/bullmq';
import { GetExportService } from './services/get-export.service';
import { FileModule } from '../file/file.module';
import { UpdateIsUserPriorityService } from './services/update-is-user-priority.service';

@Module({
  controllers: [UserController],
  providers: [
    StripeService,
    CreateUserService,
    PrismaService,
    CreateSessionService,
    CreateSecurityCodeService,
    UseSecurityCodeService,
    ValidateEmailService,
    AuthUserService,
    ResetPasswordService,
    AddBalanceService,
    GetBalanceService,
    GetFullBalanceService,
    ListTransactionsService,
    CreateCheckoutService,
    HandleWebhookService,
    ExchangeMoneyService,
    GetInsightsService,
    UpdateUserService,
    ListMessagesService,
    MessagesInsightsService,
    UpdateOnboardingStepService,
    BetaPermissionCheckService,
    GetUsersService,
    ImpersonateUserService,
    GetUserLimitsService,
    BlockPermissionService,
    VerifyTurnstileService,
    GetMessageService,
    GetSettingsService,
    UpdateDefaultSettingsService,
    UpdateUserSettingsService,
    DeleteUserSettingsService,
    CreateUtmOrViewService,
    CheckEmailService,
    CreateLeadService,
    ForceSendMessageWebhookService,
    CreateUserWebhookService,
    DeleteUserWebhookService,
    ListUserWebhookService,
    ExportMessagesService,
    UserProcessor,
    GetExportService,
    UpdateIsUserPriorityService,
  ],
  imports: [
    BullModule.registerQueue({
      name: 'user',
    }),
    EmailModule,
    SessionModule,
    forwardRef(() => FileModule),
  ],
  exports: [
    BetaPermissionCheckService,
    GetUserLimitsService,
    BlockPermissionService,
    GetSettingsService,
    GetBalanceService,
  ],
})
export class UserModule {}
