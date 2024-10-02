import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import {
  SESClient,
  GetIdentityVerificationAttributesCommand,
} from '@aws-sdk/client-ses';
import { domainSelect } from 'src/utils/public-selects';
import { Prisma, DomainStatus } from '@prisma/client';

@Injectable()
export class ListDomainsService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, status?: DomainStatus) {
    const domainWhere: Prisma.DomainFindManyArgs['where'] = {
      userId,
      deletedAt: {
        isSet: false,
      },
    };

    if (status) {
      domainWhere.status = status;
    }

    const domains = await this.prisma.domain.findMany({
      where: domainWhere,
      select: domainSelect,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const result = [];

    for (const domain of domains) {
      if (domain.status !== 'pending') {
        result.push(domain);
        continue;
      }

      const client = new SESClient();

      const getCommand = new GetIdentityVerificationAttributesCommand({
        Identities: [domain.name],
      });

      const getResponse = await client.send(getCommand);

      const verificationAttributes = getResponse.VerificationAttributes;

      if (
        verificationAttributes[domain.name]?.VerificationStatus === 'Success'
      ) {
        await this.prisma.domain.update({
          where: {
            id: domain.id,
          },
          data: {
            status: 'verified',
          },
        });

        domain.status = 'verified';
        result.push(domain);
        continue;
      } else if (
        verificationAttributes[domain.name]?.VerificationStatus === 'Pending'
      ) {
        result.push(domain);
        continue;
      } else {
        await this.prisma.domain.update({
          where: {
            id: domain.id,
          },
          data: {
            status: 'failed',
          },
        });

        domain.status = 'failed';
        result.push(domain);
        continue;
      }
    }

    return domains;
  }
}
