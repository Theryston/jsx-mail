import { Module } from '@nestjs/common';
import { DomainController } from './domain.controller';
import { CreateDomainService } from './services/create-domain.service';
import { PrismaService } from 'src/services/prisma.service';
import { DeleteDomainService } from './services/delete-domain.service';
import { ListDomainsService } from './services/list-domains.service';

@Module({
  controllers: [DomainController],
  providers: [CreateDomainService, PrismaService, DeleteDomainService, ListDomainsService]
})
export class DomainModule { }
