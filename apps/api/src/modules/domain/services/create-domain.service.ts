import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDomainDto } from '../domain.dto';
import { SESClient, VerifyDomainDkimCommand } from '@aws-sdk/client-ses';
import { PrismaService } from 'src/services/prisma.service';
import { domainSelect } from 'src/utils/public-selects';

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
        deletedAt: null,
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

    const client = new SESClient();

    const command = new VerifyDomainDkimCommand({
      Domain: name,
    });

    const sesResult = await client.send(command);

    const dkimTokens = sesResult.DkimTokens;

    const DNSRecords = dkimTokens.map((token) => {
      return {
        name: `${token}._domainkey.${name}`,
        value: `${token}.dkim.amazonses.com`,
        type: 'CNAME',
        ttl: 1800,
      };
    });

    const domain = await this.prisma.domain.create({
      data: {
        name,
        userId,
        dnsRecords: {
          createMany: {
            data: DNSRecords,
          },
        },
      },
      select: domainSelect,
    });

    return domain;
  }
}
