import { Inject, Injectable } from '@nestjs/common';
import { domainSelect } from 'src/utils/public-selects';
import { Prisma, DomainStatus, PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class ListDomainsService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute(userId: string, status?: DomainStatus) {
    const domainWhere: Prisma.DomainFindManyArgs['where'] = {
      userId,
      deletedAt: null,
    };

    if (status) domainWhere.status = status;

    const domains = await this.prisma.client.domain.findMany({
      where: domainWhere,
      select: domainSelect,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return domains;
  }
}
