import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
  Req,
  Query,
  Headers,
  ValidationPipe,
  Delete,
  Param,
} from '@nestjs/common';
import { CreateUserService } from './services/create-user.service';
import {
  AuthUserDto,
  BlockPermissionDto,
  CheckEmailDto,
  CreateCheckoutDto,
  CreateLeadDto,
  CreateSecurityCodeDto,
  CreateUserDto,
  CreateUserWebhookDto,
  CreateUtmDto,
  ForceSendMessageWebhookDto,
  GetUsersDto,
  ImpersonateUserDto,
  ListMessagesDto,
  MessagesInsightsDto,
  ResetPasswordDto,
  UpdateDefaultSettingsDto,
  UpdateOnboardingDto,
  UpdateUserSettingsDto,
  UseSecurityCodeDto,
} from './user.dto';
import { Permissions } from 'src/auth/permissions.decorator';
import { PERMISSIONS } from 'src/auth/permissions';
import { CreateSecurityCodeService } from './services/create-security-code.service';
import { UseSecurityCodeService } from './services/use-security-code.service';
import { ValidateEmailService } from './services/validate-email.service';
import { AuthUserService } from './services/auth-user.service';
import { ResetPasswordService } from './services/reset-password.service';
import { MONEY_SCALE } from 'src/utils/constants';
import { friendlyMoney } from 'src/utils/format-money';
import { GetFullBalanceService } from './services/get-full-balance.service';
import { ListTransactionsService } from './services/list-transactions.service';
import { CreateCheckoutService } from './services/create-checkout.service';
import { StripeService } from 'src/services/stripe.service';
import { HandleWebhookService } from './services/handle-webhook.service';
import { GetInsightsService } from './services/get-insights.service';
import { UpdateUserService } from './services/update-user.service';
import { ListMessagesService } from './services/list-messages.service';
import { MessagesInsightsService } from './services/messages-insights.service';
import { MESSAGES_STATUS } from '../../utils/constants';
import { UpdateOnboardingStepService } from './services/update-onboarding-step.service';
import { GetUsersService } from './services/get-users.service';
import { ImpersonateUserService } from './services/impersonate-user.service';
import { Fingerprint, IFingerprint } from 'nestjs-fingerprint';
import { RealIP } from 'nestjs-real-ip';
import { BlockPermissionService } from './services/block-permission.service';
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

@Controller('user')
export class UserController {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly createSecurityCodeService: CreateSecurityCodeService,
    private readonly useSecurityCodeService: UseSecurityCodeService,
    private readonly validateEmailService: ValidateEmailService,
    private readonly authUserService: AuthUserService,
    private readonly resetPasswordService: ResetPasswordService,
    private readonly getFullBalanceService: GetFullBalanceService,
    private readonly listTransactionsService: ListTransactionsService,
    private readonly createCheckoutService: CreateCheckoutService,
    private readonly stripeService: StripeService,
    private readonly handleWebhookService: HandleWebhookService,
    private readonly getInsightsService: GetInsightsService,
    private readonly updateUserService: UpdateUserService,
    private readonly listMessagesService: ListMessagesService,
    private readonly messagesInsightsService: MessagesInsightsService,
    private readonly updateOnboardingService: UpdateOnboardingStepService,
    private readonly getUsersService: GetUsersService,
    private readonly impersonateUserService: ImpersonateUserService,
    private readonly blockPermissionService: BlockPermissionService,
    private readonly getMessageService: GetMessageService,
    private readonly getSettingsService: GetSettingsService,
    private readonly updateDefaultSettingsService: UpdateDefaultSettingsService,
    private readonly updateUserSettingsService: UpdateUserSettingsService,
    private readonly deleteUserSettingsService: DeleteUserSettingsService,
    private readonly createUtmOrViewService: CreateUtmOrViewService,
    private readonly checkEmailService: CheckEmailService,
    private readonly createLeadService: CreateLeadService,
    private readonly forceSendMessageWebhookService: ForceSendMessageWebhookService,
    private readonly createUserWebhookService: CreateUserWebhookService,
    private readonly deleteUserWebhookService: DeleteUserWebhookService,
    private readonly listUserWebhookService: ListUserWebhookService,
  ) {}

  @Post('check-email')
  checkEmail(@Body() data: CheckEmailDto) {
    return this.checkEmailService.execute(data);
  }

  @Post('lead')
  createLead(@Body() data: CreateLeadDto) {
    return this.createLeadService.execute(data);
  }

  @Get('admin/users')
  @Permissions([PERMISSIONS.OTHER_GET_USERS.value])
  getUsers(@Query() data: GetUsersDto) {
    return this.getUsersService.execute({
      ...data,
      take: Number(data.take) || 10,
      page: Number(data.page) || 1,
    });
  }

  @Post('admin/users/impersonate')
  @Permissions([PERMISSIONS.OTHER_IMPERSONATE_USER.value])
  impersonateUser(@Body() data: ImpersonateUserDto, @Request() req) {
    return this.impersonateUserService.execute(data, req.user.id);
  }

  @Put()
  @Permissions([PERMISSIONS.SELF_UPDATE.value])
  updateUser(@Request() req) {
    return this.updateUserService.execute({
      ...req.body,
      userId: req.user.id,
    });
  }

  @Post()
  createUser(
    @Body() data: CreateUserDto,
    @Fingerprint() fp: IFingerprint,
    @RealIP() ipAddress: string,
    @Request() req,
  ) {
    return this.createUserService.execute({
      ...data,
      fingerprint: fp.id,
      ipAddress: req.realIp || ipAddress,
    });
  }

  @Post('security-code')
  createSecurityCode(@Body() data: CreateSecurityCodeDto) {
    return this.createSecurityCodeService.execute(data);
  }

  @Post('security-code/use')
  useSecurityCode(@Body() data: UseSecurityCodeDto) {
    return this.useSecurityCodeService.execute(data);
  }

  @Put('validate-email')
  @Permissions([PERMISSIONS.SELF_EMAIL_VALIDATE.value])
  validateEmail(@Request() req) {
    return this.validateEmailService.execute(req.user.id, req.permissions);
  }

  @Post('auth')
  authUser(@Body() data: AuthUserDto) {
    return this.authUserService.execute(data);
  }

  @Post('reset-password')
  @Permissions([PERMISSIONS.SELF_RESET_PASSWORD.value])
  resetPassword(@Body() data: ResetPasswordDto, @Request() req) {
    return this.resetPasswordService.execute({
      ...data,
      userId: req.user.id,
      permissions: req.permissions,
    });
  }

  @Get('me')
  @Permissions([PERMISSIONS.SELF_GET.value])
  getMe(@Request() req) {
    return {
      ...req.user,
      blockedPermissions: req.blockedPermissions.map(
        (permission) => permission.permission,
      ),
      session: {
        id: req.session.id,
        createdAt: req.session.createdAt,
        expiresAt: req.session.expiresAt,
        permissions: req.session.permissions,
        description: req.session.description,
        impersonateUserId: req.session.impersonateUserId,
      },
    };
  }

  @Get('balance')
  @Permissions([PERMISSIONS.SELF_GET_BALANCE.value])
  getBalance(@Request() req) {
    return this.getFullBalanceService.execute(req.user.id);
  }

  @Get('transactions')
  @Permissions([PERMISSIONS.SELF_LIST_TRANSACTIONS.value])
  listFiles(@Req() req, @Query() data: any) {
    return this.listTransactionsService.execute(
      {
        take: Number(data.take) || 10,
        page: Number(data.page) || 1,
      },
      req.user.id,
    );
  }

  @Get('messages')
  @Permissions([PERMISSIONS.SELF_LIST_MESSAGES.value])
  listMessages(
    @Req() req,
    @Query(new ValidationPipe({ transform: true })) data: ListMessagesDto,
  ) {
    return this.listMessagesService.execute(data, req.user.id);
  }

  @Get('messages/insights')
  @Permissions([PERMISSIONS.SELF_MESSAGES_INSIGHT.value])
  getMessagesInsights(
    @Req() req,
    @Query(new ValidationPipe({ transform: true })) data: MessagesInsightsDto,
  ) {
    return this.messagesInsightsService.execute(data, req.user.id);
  }

  @Get('messages/status')
  listStatusMessages(@Req() req) {
    return MESSAGES_STATUS;
  }

  @Get('messages/:id')
  @Permissions([PERMISSIONS.SELF_GET_MESSAGE.value])
  getMessage(@Param('id') id: string, @Request() req) {
    return this.getMessageService.execute(id, req.user.id);
  }

  @Post('checkout')
  @Permissions([PERMISSIONS.SELF_CREATE_CHECKOUT.value])
  createCheckout(@Request() req, @Body() data: CreateCheckoutDto) {
    return this.createCheckoutService.execute(data, req.user.id);
  }

  @Post('billing/webhook')
  validateBilling(@Headers('stripe-signature') signature: string, @Req() req) {
    const body = this.stripeService.stripe.webhooks.constructEvent(
      req.rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    return this.handleWebhookService.execute(body);
  }

  @Get('insights')
  @Permissions([PERMISSIONS.SELF_GET_INSIGHTS.value])
  getInsights(@Request() req) {
    return this.getInsightsService.execute(req.user.id);
  }

  @Get('price')
  async price() {
    const settings = await this.getSettingsService.execute();

    return {
      MONEY_SCALE: MONEY_SCALE,
      FREE_EMAILS_PER_MONTH: settings.freeEmailsPerMonth,
      EMAIL_PRICING: {
        unit: 1000,
        unitName: 'emails',
        step: 1000,
        minValue: 1000,
        maxValue: 1000000,
        defaultValue: settings.freeEmailsPerMonth,
        price: settings.pricePerMessage * 1000,
        friendlyAmount: friendlyMoney(settings.pricePerMessage * 1000, true),
      },
    };
  }

  @Put('onboarding')
  @Permissions([PERMISSIONS.SELF_UPDATE_ONBOARDING.value])
  updateOnboarding(@Request() req, @Body() data: UpdateOnboardingDto) {
    return this.updateOnboardingService.execute(data, req.user.id);
  }

  @Post('block-permission')
  @Permissions([PERMISSIONS.OTHER_BLOCK_PERMISSION.value])
  blockPermission(@Body() data: BlockPermissionDto) {
    return this.blockPermissionService.create(data);
  }

  @Delete('block-permission')
  @Permissions([PERMISSIONS.OTHER_BLOCK_PERMISSION.value])
  deleteBlockPermission(@Body() data: BlockPermissionDto) {
    return this.blockPermissionService.delete(data);
  }

  @Get('blocked-permissions/:userId')
  @Permissions([PERMISSIONS.OTHER_BLOCK_PERMISSION.value])
  getBlockedPermissions(@Param('userId') userId: string) {
    return this.blockPermissionService.get(userId);
  }

  @Get('settings/default')
  @Permissions([PERMISSIONS.OTHER_GET_DEFAULT_SETTINGS.value])
  getSettings() {
    return this.getSettingsService.getDefaultSettings();
  }

  @Put('settings/default')
  @Permissions([PERMISSIONS.OTHER_UPDATE_DEFAULT_SETTINGS.value])
  updateSettings(@Body() data: UpdateDefaultSettingsDto) {
    return this.updateDefaultSettingsService.execute(data);
  }

  @Get('settings/user/:userId')
  @Permissions([PERMISSIONS.OTHER_GET_USER_SETTINGS.value])
  getUserSettings(@Param('userId') userId: string) {
    return this.getSettingsService.execute(userId, { noScale: true });
  }

  @Put('settings/user/:userId')
  @Permissions([PERMISSIONS.OTHER_UPDATE_USER_SETTINGS.value])
  updateUserSettings(
    @Body() data: UpdateUserSettingsDto,
    @Param('userId') userId: string,
  ) {
    return this.updateUserSettingsService.execute(userId, data);
  }

  @Delete('settings/user/:userId')
  @Permissions([PERMISSIONS.OTHER_DELETE_USER_SETTINGS.value])
  deleteUserSettings(@Param('userId') userId: string) {
    return this.deleteUserSettingsService.execute(userId);
  }

  @Post('utm')
  createUtm(@Body() data: CreateUtmDto) {
    return this.createUtmOrViewService.execute(data);
  }

  @Post('messages/:id/webhook')
  @Permissions([PERMISSIONS.SELF_FORCE_SEND_MESSAGE_WEBHOOK.value])
  forceSendMessageWebhook(
    @Param('id') id: string,
    @Body() data: ForceSendMessageWebhookDto,
    @Request() req,
  ) {
    return this.forceSendMessageWebhookService.execute(id, data, req.user.id);
  }

  @Post('webhook')
  @Permissions([PERMISSIONS.SELF_CREATE_USER_WEBHOOK.value])
  createUserWebhook(@Body() data: CreateUserWebhookDto, @Request() req) {
    return this.createUserWebhookService.execute(data, req.user.id);
  }

  @Delete('webhook/:id')
  @Permissions([PERMISSIONS.SELF_DELETE_USER_WEBHOOK.value])
  deleteUserWebhook(@Param('id') id: string, @Request() req) {
    return this.deleteUserWebhookService.execute(id, req.user.id);
  }

  @Get('webhooks')
  @Permissions([PERMISSIONS.SELF_LIST_USER_WEBHOOK.value])
  listUserWebhooks(@Request() req) {
    return this.listUserWebhookService.execute(req.user.id);
  }
}
