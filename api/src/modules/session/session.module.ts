import { Module } from '@nestjs/common';
import { SessionController } from './session.controller';
import { DeleteSessionService } from './services/delete-session.service';
import { PrismaService } from 'src/services/prisma.service';
import { CreateSessionService } from './services/create-session.service';
import { ListSessionsService } from './services/list-sessions.service';

@Module({
  controllers: [SessionController],
  providers: [DeleteSessionService, PrismaService, CreateSessionService, ListSessionsService]
})
export class SessionModule { }
