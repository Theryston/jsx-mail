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
} from '@nestjs/common';
import { CreateUserService } from './services/create-user.service';
import {
  AuthUserDto,
  CreateCheckoutDto,
  CreateSecurityCodeDto,
  CreateUserDto,
  ListMessagesDto,
  MessagesInsightsDto,
  ResetPasswordDto,
  UseSecurityCodeDto,
} from './user.dto';
import { Permissions } from 'src/auth/permissions.decorator';
import { PERMISSIONS } from 'src/auth/permissions';
import { CreateSecurityCodeService } from './services/create-security-code.service';
import { UseSecurityCodeService } from './services/use-security-code.service';
import { ValidateEmailService } from './services/validate-email.service';
import { AuthUserService } from './services/auth-user.service';
import { ResetPasswordService } from './services/reset-password.service';
import {
  FREE_BALANCE,
  MONEY_SCALE,
  PRICE_PER_MESSAGE,
} from 'src/utils/constants';
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
  ) {}

  @Put()
  @Permissions([PERMISSIONS.SELF_UPDATE.value])
  updateUser(@Request() req) {
    return this.updateUserService.execute({
      ...req.body,
      userId: req.user.id,
    });
  }

  @Post()
  createUser(@Body() data: CreateUserDto) {
    return this.createUserService.execute(data);
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
    return req.user;
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
  price() {
    return {
      MONEY_SCALE: MONEY_SCALE,
      FREE_BALANCE: FREE_BALANCE,
      EMAIL_PRICING: {
        unit: 1000,
        unitName: 'emails',
        step: 1000,
        minValue: 1000,
        maxValue: 1000000,
        defaultValue: 10000,
        price: PRICE_PER_MESSAGE * 1000,
        friendlyAmount: friendlyMoney(PRICE_PER_MESSAGE * 1000, true),
      },
    };
  }
}
