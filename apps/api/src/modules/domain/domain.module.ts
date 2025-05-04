import { Module } from '@nestjs/common';
import { DomainController } from './domain.controller';
import { CreateDomainService } from './services/create-domain.service';
import { DeleteDomainService } from './services/delete-domain.service';
import { ListDomainsService } from './services/list-domains.service';
import { VerifyDomainService } from './services/verify-domain.service';
import { EmailModule } from 'src/modules/email/email.module';

@Module({
  controllers: [DomainController],
  providers: [
    CreateDomainService,
    DeleteDomainService,
    ListDomainsService,
    VerifyDomainService,
  ],
  imports: [EmailModule],
})
export class DomainModule {}
