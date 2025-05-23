import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthGuard } from './auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { EmailModule } from './modules/email/email.module';
import { SessionModule } from './modules/session/session.module';
import { DomainModule } from './modules/domain/domain.module';
import { FileModule } from './modules/file/file.module';
import { GetBalanceService } from './modules/user/services/get-balance.service';
import { SenderModule } from './modules/sender/sender.module';
import { StripeService } from './services/stripe.service';
import { WorkerModule } from './modules/worker/worker.module';
import { BullModule } from '@nestjs/bullmq';
import { BetaPermissionCheckService } from './modules/user/services/beta-permission-check.service';
import { BulkSendingModule } from './modules/bulk-sending/bulk-sending.module';
import { NestjsFingerprintModule } from 'nestjs-fingerprint';
import { CloudflareIpMiddleware } from './middleware/cloudflare-ip.middleware';
import { CustomPrismaModule } from 'nestjs-prisma';
import { createSoftDeleteMiddleware } from 'prisma-soft-delete-middleware';
import models from './models';
import { PrismaClient } from '@prisma/client';

const prismaMiddleware = createSoftDeleteMiddleware({
  models,
  defaultConfig: {
    field: 'deletedAt',
    createValue(deleted) {
      if (deleted) return new Date();
      return null;
    },
  },
});

const prisma = new PrismaClient();

prisma.$use(prismaMiddleware);

@Module({
  imports: [
    CustomPrismaModule.forRoot({
      isGlobal: true,
      name: 'prisma',
      client: prisma,
    }),
    NestjsFingerprintModule.forRoot({
      params: ['userAgent', 'ipAddress'],
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
      },
    }),
    UserModule,
    EmailModule,
    SessionModule,
    DomainModule,
    FileModule,
    SenderModule,
    WorkerModule,
    BulkSendingModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    GetBalanceService,
    StripeService,
    BetaPermissionCheckService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CloudflareIpMiddleware).forRoutes('*');
  }
}
