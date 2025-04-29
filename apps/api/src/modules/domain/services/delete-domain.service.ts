import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { DeleteEmailIdentityCommand } from '@aws-sdk/client-sesv2';
import { sesv2Client } from '../ses';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class DeleteDomainService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
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

    const deleteCommand = new DeleteEmailIdentityCommand({
      EmailIdentity: domain.name,
    });

    await sesv2Client.send(deleteCommand);

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
