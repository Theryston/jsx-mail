import {
  Body,
  Controller,
  Post,
  Req,
  Delete,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { PERMISSIONS } from 'src/auth/permissions';
import { Permissions } from 'src/auth/permissions.decorator';
import { CreateDomainService } from './services/create-domain.service';
import { CreateDomainDto } from './domain.dto';
import { DeleteDomainService } from './services/delete-domain.service';
import { ListDomainsService } from './services/list-domains.service';

@Controller('domain')
export class DomainController {
  constructor(
    private readonly createDomainService: CreateDomainService,
    private readonly deleteDomainService: DeleteDomainService,
    private readonly listDomainsService: ListDomainsService,
  ) { }

  @Post()
  @Permissions([PERMISSIONS.SELF_DOMAIN_CREATE.value])
  async create(@Body() data: CreateDomainDto, @Req() req) {
    return this.createDomainService.execute(data, req.user.id);
  }

  @Delete(':id')
  @Permissions([PERMISSIONS.SELF_DOMAIN_DELETE.value])
  async delete(@Param('id') id: string, @Req() req) {
    return this.deleteDomainService.execute(id, req.user.id);
  }

  @Get()
  @Permissions([PERMISSIONS.SELF_LIST_DOMAINS.value])
  async list(@Req() req, @Query() query: any) {
    return this.listDomainsService.execute(req.user.id, query?.status);
  }
}
