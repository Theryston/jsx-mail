import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthGuard } from './auth/auth.guard';
import { APP_GUARD } from '@nestjs/core'
import { PrismaService } from './services/prisma.service';
import { EmailModule } from './modules/email/email.module';

@Module({
  imports: [UserModule, EmailModule],
  controllers: [],
  providers: [{
    provide: APP_GUARD,
    useClass: AuthGuard,
  }, PrismaService],
})
export class AppModule { }
