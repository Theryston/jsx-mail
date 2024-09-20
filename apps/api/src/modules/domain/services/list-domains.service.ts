import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { domainSelect } from 'src/utils/public-selects';
import { Prisma, DomainStatus } from '@prisma/client';
import azureCredential from '../../../config/azure-credential';
import { CommunicationServiceManagementClient } from '@azure/arm-communication';

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

    const mgmtClient = new CommunicationServiceManagementClient(
      azureCredential,
      process.env.AZURE_SUBSCRIPTION_ID as string,
    );

    const result = [];

    for (const domain of domains) {
      if (domain.status !== 'pending') {
        result.push(domain);
        continue;
      }

      const azureDomain = await mgmtClient.domains.get(
        process.env.AZURE_RESOURCE_GROUP_NAME as string,
        process.env.AZURE_EMAIL_SERVICE_NAME as string,
        domain.name,
      );

      delete azureDomain.verificationStates.dmarc;

      const status = Object.values(azureDomain.verificationStates || {}).map(
        (s) => s.status,
      );
      const notStartedItems = Object.keys(azureDomain.verificationStates || {})
        .map((s) => ({
          key: s,
          status: azureDomain.verificationStates[s].status,
        }))
        .filter((s) => s.status === 'NotStarted');

      const isError =
        status.find((s) => s === 'VerificationFailed') ||
        status.find((s) => s === 'CancellationRequested');
      const isVerified = status.every((s) => s === 'Verified');

      if (isError) {
        await this.prisma.domain.update({
          where: {
            id: domain.id,
          },
          data: {
            status: 'failed',
          },
        });

        domain.status = 'failed';
      }

      if (isVerified) {
        const allDomains = await this.prisma.domain.findMany({
          select: { name: true },
          where: {
            status: 'verified',
            deletedAt: {
              isSet: false,
            },
          },
        });

        await mgmtClient.communicationServices.beginCreateOrUpdate(
          process.env.AZURE_RESOURCE_GROUP_NAME as string,
          process.env.AZURE_EMAIL_SERVICE_NAME as string,
          {
            dataLocation: 'United States',
            location: 'global',
            linkedDomains: [
              `/subscriptions/${process.env.AZURE_SUBSCRIPTION_ID}/resourceGroups/${process.env.AZURE_RESOURCE_GROUP_NAME}/providers/Microsoft.Communication/emailServices/${process.env.AZURE_EMAIL_SERVICE_NAME}/domains/${domain.name}`,
              ...allDomains.map(
                (d) =>
                  `/subscriptions/${process.env.AZURE_SUBSCRIPTION_ID}/resourceGroups/${process.env.AZURE_RESOURCE_GROUP_NAME}/providers/Microsoft.Communication/emailServices/${process.env.AZURE_EMAIL_SERVICE_NAME}/domains/${d.name}`,
              ),
            ],
          },
        );

        await this.prisma.domain.update({
          where: {
            id: domain.id,
          },
          data: {
            status: 'verified',
          },
        });

        domain.status = 'verified';
      }

      for (const notStartedItem of notStartedItems) {
        const key = {
          domain: 'Domain',
          spf: 'SPF',
          dkim: 'DKIM',
          dkim2: 'DKIM2',
        }[notStartedItem.key];

        if (!key) continue;

        mgmtClient.domains.beginInitiateVerification(
          process.env.AZURE_RESOURCE_GROUP_NAME as string,
          process.env.AZURE_EMAIL_SERVICE_NAME as string,
          domain.name,
          {
            verificationType: key,
          },
        );
      }

      result.push(domain);
    }

    return domains;
  }
}
