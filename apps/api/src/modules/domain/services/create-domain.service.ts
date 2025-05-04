import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateDomainDto } from '../domain.dto';
import { domainSelect } from 'src/utils/public-selects';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import { MailServerService } from 'src/modules/email/services/mail-server.service';

const domainRegex = /^(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;

@Injectable()
export class CreateDomainService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
    private readonly mailServerService: MailServerService,
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

    const {
      spfRecord,
      dkimRecord,
      domainId: externalId,
    } = await this.mailServerService.createDomain(name);

    console.log('spfRecord', spfRecord);
    console.log('dkimRecord', dkimRecord);
    console.log('externalId', externalId);

    if (!spfRecord || !dkimRecord) {
      throw new HttpException(
        'Failed to create domain',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      !spfRecord.name ||
      !dkimRecord.name ||
      !spfRecord.record ||
      !dkimRecord.record
    ) {
      throw new HttpException(
        'Failed to create domain',
        HttpStatus.BAD_REQUEST,
      );
    }

    const domain = await this.prisma.client.domain.create({
      data: {
        name,
        userId,
        externalId,
        dnsRecords: {
          createMany: {
            data: [
              {
                name: spfRecord.name,
                value: spfRecord.record,
                type: 'TXT',
                ttl: 1800,
              },
              {
                name: dkimRecord.name,
                value: dkimRecord.record,
                type: 'TXT',
                ttl: 1800,
              },
            ],
          },
        },
      },
      select: domainSelect,
    });

    return domain;
  }
}
