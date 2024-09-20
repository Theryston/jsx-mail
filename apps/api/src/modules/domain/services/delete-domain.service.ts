import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { CommunicationServiceManagementClient } from '@azure/arm-communication';
import azureCredential from '../../../config/azure-credential';

@Injectable()
export class DeleteDomainService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(domainId: string, userId: string) {
    const domain = await this.prisma.domain.findFirst({
      where: {
        id: domainId,
        userId,
        deletedAt: {
          isSet: false,
        },
      },
    });

    if (!domain) {
      throw new HttpException('Domain not found', HttpStatus.NOT_FOUND);
    }

    const mgmtClient = new CommunicationServiceManagementClient(
      azureCredential,
      process.env.AZURE_SUBSCRIPTION_ID as string,
    );

    await mgmtClient.domains.beginDeleteAndWait(
      process.env.AZURE_RESOURCE_GROUP_NAME as string,
      process.env.AZURE_EMAIL_SERVICE_NAME as string,
      domain.name,
    );

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
