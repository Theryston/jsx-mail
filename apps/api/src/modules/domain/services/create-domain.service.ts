import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateDomainDto } from '../domain.dto';
import { domainSelect } from 'src/utils/public-selects';
import { generateKeyPairSync } from 'crypto';
import { CreateEmailIdentityCommand } from '@aws-sdk/client-sesv2';
import { sesv2Client } from '../ses';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

const domainRegex = /^(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;

@Injectable()
export class CreateDomainService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute({ name }: CreateDomainDto, userId: string) {
    if (!domainRegex.test(name)) {
      throw new HttpException('Invalid domain', HttpStatus.BAD_REQUEST);
    }

    const domainExists = await this.prisma.client.domain.findFirst({
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

    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 1024,
      publicExponent: 0x10001,
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
    });

    const selector = 'jsxmail';

    const privateKeyCleaned = privateKey
      .replace(/-----BEGIN RSA PRIVATE KEY-----/, '')
      .replace(/-----END RSA PRIVATE KEY-----/, '')
      .replace(/\n/g, '')
      .trim();

    const publicKeyCleaned = publicKey
      .replace(/-----BEGIN PUBLIC KEY-----/, '')
      .replace(/-----END PUBLIC KEY-----/, '')
      .replace(/\n/g, '')
      .trim();

    const command = new CreateEmailIdentityCommand({
      EmailIdentity: name,
      DkimSigningAttributes: {
        DomainSigningSelector: selector,
        DomainSigningPrivateKey: privateKeyCleaned,
      },
    });

    await sesv2Client.send(command);

    const domain = await this.prisma.client.domain.create({
      data: {
        name,
        userId,
        dkim: {
          create: {
            publicKey: publicKeyCleaned,
            privateKey: privateKeyCleaned,
            selector,
          },
        },
        dnsRecords: {
          create: {
            name: `${selector}._domainkey.${name}`,
            value: `p=${publicKeyCleaned}`,
            type: 'TXT',
            ttl: 1800,
          },
        },
      },
      select: domainSelect,
    });

    return domain;
  }
}
