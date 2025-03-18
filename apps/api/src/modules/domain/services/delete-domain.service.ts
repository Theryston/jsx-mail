import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { DeleteEmailIdentityCommand } from '@aws-sdk/client-sesv2';
import { sesv2Client } from '../ses';

@Injectable()
export class DeleteDomainService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(domainId: string, userId: string) {
    const domain = await this.prisma.domain.findFirst({
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

    await this.prisma.domain.update({
      where: {
        id: domainId,
      },
      data: {
        deletedAt: new Date(),
        name: new Date().getTime().toString(),
      },
    });

    return {
      message: 'Domain deleted successfully',
    };
  }
}
