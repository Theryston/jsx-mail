import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthGuard } from './auth/auth.guard';
import { APP_GUARD } from '@nestjs/core'
import { PrismaService } from './services/prisma.service';
import { EmailModule } from './modules/email/email.module';
import { SessionModule } from './modules/session/session.module';
import { DomainModule } from './modules/domain/domain.module';
import { FileModule } from './modules/file/file.module';
import { GetBalanceService } from './modules/user/services/get-balance.service';
import { SenderModule } from './modules/sender/sender.module';

@Module({
  imports: [UserModule, EmailModule, SessionModule, DomainModule, FileModule, SenderModule],
  controllers: [],
  providers: [{
    provide: APP_GUARD,
    useClass: AuthGuard,
  }, PrismaService, GetBalanceService],
})
export class AppModule { }
