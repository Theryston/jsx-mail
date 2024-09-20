import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDomainDto } from '../domain.dto';
import { PrismaService } from 'src/services/prisma.service';
import { domainSelect } from 'src/utils/public-selects';
import {
  CommunicationServiceManagementClient,
  KnownDomainManagement,
} from '@azure/arm-communication';
import azureCredential from '../../../config/azure-credential';

const domainRegex = /^(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;

@Injectable()
export class CreateDomainService {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ name }: CreateDomainDto, userId: string) {
    if (!domainRegex.test(name)) {
      throw new HttpException('Invalid domain', HttpStatus.BAD_REQUEST);
    }

    const domainExists = await this.prisma.domain.findFirst({
      where: {
        name,
        deletedAt: {
          isSet: false,
        },
      },
    });

    if (domainExists && domainExists.userId === userId) {
      throw new HttpException('Domain already exists', HttpStatus.BAD_REQUEST);
    }

    if (domainExists && domainExists.userId !== userId) {
      throw new HttpException(
        'Domain already exists and belongs to another user',
        HttpStatus.CONFLICT,
      );
    }

    const mgmtClient = new CommunicationServiceManagementClient(
      azureCredential,
      process.env.AZURE_SUBSCRIPTION_ID as string,
    );

    const domain = await mgmtClient.domains.beginCreateOrUpdateAndWait(
      process.env.AZURE_RESOURCE_GROUP_NAME as string,
      process.env.AZURE_EMAIL_SERVICE_NAME as string,
      name,
      {
        location: 'global',
        domainManagement: KnownDomainManagement.CustomerManaged,
      },
    );

    if (!domain.verificationRecords) {
      throw new HttpException(
        'Domain verification failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const DNSRecords = Object.keys(domain.verificationRecords).map(
      (key) => domain.verificationRecords[key],
    );

    const domainDb = await this.prisma.domain.create({
      data: {
        name,
        userId,
        dnsRecords: {
          createMany: {
            data: DNSRecords,
          },
        },
        senders: {
          create: {
            name: 'DoNotReply',
            username: 'DoNotReply',
            email: `DoNotReply@${name}`,
            user: {
              connect: {
                id: userId,
              },
            },
          },
        },
      },
      select: domainSelect,
    });

    return domainDb;
  }
}
