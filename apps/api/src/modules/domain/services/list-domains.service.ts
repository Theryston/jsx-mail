import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { domainSelect } from 'src/utils/public-selects';
import { Prisma, DomainStatus } from '@prisma/client';

@Injectable()
export class ListDomainsService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, status?: DomainStatus) {
    const domainWhere: Prisma.DomainFindManyArgs['where'] = {
      userId,
      deletedAt: null,
    };

    if (status) domainWhere.status = status;

    const domains = await this.prisma.domain.findMany({
      where: domainWhere,
      select: domainSelect,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return domains;
  }
}
