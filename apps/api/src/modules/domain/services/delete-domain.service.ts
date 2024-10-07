import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import {
  SESClient,
  GetIdentityVerificationAttributesCommand,
  DeleteIdentityCommand,
} from '@aws-sdk/client-ses';

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

    const client = new SESClient();

    const getCommand = new GetIdentityVerificationAttributesCommand({
      Identities: [domain.name],
    });

    const getResponse = await client.send(getCommand);
    const verificationAttributes = getResponse.VerificationAttributes;

    if (verificationAttributes[domain.name]?.VerificationStatus) {
      const deleteCommand = new DeleteIdentityCommand({
        Identity: domain.name,
      });

      await client.send(deleteCommand);
    }

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
