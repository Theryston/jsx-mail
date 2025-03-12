import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { domainSelect } from 'src/utils/public-selects';
import { sesClient } from '../ses';
import {
  GetEmailIdentityCommand,
  VerificationStatus,
} from '@aws-sdk/client-sesv2';
import { DomainStatus } from '@prisma/client';

@Injectable()
export class VerifyDomainService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string, userId: string) {
    const domain = await this.prisma.domain.findUnique({
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
      await sesClient.send(command);

    const statusMap: Record<VerificationStatus, DomainStatus> = {
      FAILED: 'failed',
      NOT_STARTED: 'pending',
      PENDING: 'pending',
      SUCCESS: 'verified',
      TEMPORARY_FAILURE: 'pending',
    };

    const newStatus = statusMap[status];

    const updatedDomain = await this.prisma.domain.update({
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
