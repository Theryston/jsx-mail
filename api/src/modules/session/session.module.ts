import { Module } from '@nestjs/common';
import { SessionController } from './session.controller';
import { DeleteSessionService } from './services/delete-session.service';
import { PrismaService } from 'src/services/prisma.service';

@Module({
  controllers: [SessionController],
  providers: [DeleteSessionService, PrismaService]
})
export class SessionModule { }
