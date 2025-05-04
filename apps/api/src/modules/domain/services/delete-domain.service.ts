import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import { MailServerService } from 'src/modules/email/services/mail-server.service';

@Injectable()
export class DeleteDomainService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
    private readonly mailServerService: MailServerService,
  ) {}

  async execute(domainId: string, userId: string) {
    const domain = await this.prisma.client.domain.findFirst({
      where: {
        id: domainId,
        userId,
        deletedAt: null,
      },
    });

    if (!domain) {
      throw new HttpException('Domain not found', HttpStatus.NOT_FOUND);
    }

    await this.mailServerService.deleteDomain(domain.externalId);

    await this.prisma.client.domain.update({
      where: {
        id: domain.id,
      },
      data: {
        name: `${domain.name}-${domain.id}`,
      },
    });

    await this.prisma.client.domain.delete({
      where: {
        id: domainId,
      },
    });

    return {
      message: 'Domain deleted successfully',
    };
  }
}
