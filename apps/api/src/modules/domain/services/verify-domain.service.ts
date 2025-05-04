import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { domainSelect } from 'src/utils/public-selects';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import { MailServerService } from 'src/modules/email/services/mail-server.service';
@Injectable()
export class VerifyDomainService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
    private readonly mailServerService: MailServerService,
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

    if (!domain.externalId) {
      throw new HttpException('Domain not found', HttpStatus.NOT_FOUND);
    }

    const domainDetails = await this.mailServerService.verifyDomain(
      domain.externalId,
    );

    if (
      domainDetails.spf.status === 'good' &&
      domainDetails.dkim.status === 'good'
    ) {
      const updatedDomain = await this.prisma.client.domain.update({
        where: { id },
        data: { status: 'verified' },
        select: domainSelect,
      });

      return {
        ...updatedDomain,
        lastVerificationAt: new Date(),
      };
    } else {
      return {
        ...domain,
        lastVerificationAt: new Date(),
      };
    }
  }
}
