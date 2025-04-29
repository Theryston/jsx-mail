import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { domainSelect } from 'src/utils/public-selects';
import { sesv2Client } from '../ses';
import {
  GetEmailIdentityCommand,
  VerificationStatus,
} from '@aws-sdk/client-sesv2';
import { DomainStatus, PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class VerifyDomainService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute(id: string, userId: string) {
    const domain = await this.prisma.client.domain.findUnique({
      where: { id, userId },
      select: {
        ...domainSelect,
        dkim: true,
      },
    });

    if (!domain) {
      throw new HttpException('Domain not found', HttpStatus.NOT_FOUND);
    }

    if (domain.status === 'verified') {
      return domain;
    }

    const command = new GetEmailIdentityCommand({
      EmailIdentity: domain.name,
    });

    const { VerificationStatus: status, VerificationInfo } =
      await sesv2Client.send(command);

    const statusMap: Record<VerificationStatus, DomainStatus> = {
      FAILED: 'failed',
      NOT_STARTED: 'pending',
      PENDING: 'pending',
      SUCCESS: 'verified',
      TEMPORARY_FAILURE: 'pending',
    };

    const newStatus = statusMap[status];

    const updatedDomain = await this.prisma.client.domain.update({
      where: { id },
      data: { status: newStatus },
      select: {
        ...domainSelect,
        dkim: true,
      },
    });

    delete updatedDomain.dkim;

    return {
      ...updatedDomain,
      lastVerificationAt: VerificationInfo?.LastCheckedTimestamp,
    };
  }
}
