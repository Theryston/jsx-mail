import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateSenderDto } from '../sender.dto';
import { senderSelect } from 'src/utils/public-selects';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class CreateSenderService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute(
    { domainName, username, name }: CreateSenderDto,
    userId: string,
  ) {
    username = username.toLowerCase().trim();

    const domainWhere = {
      name: domainName,
      userId,
      deletedAt: null,
    };

    if (domainName === process.env.DEFAULT_EMAIL_DOMAIN_NAME) {
      delete domainWhere.userId;
    }

    const domain = await this.prisma.client.domain.findFirst({
      where: domainWhere,
    });

    if (!domain) {
      throw new HttpException('Domain not found', HttpStatus.NOT_FOUND);
    }

    const email = `${username}@${domain.name}`;

    const senderExists = await this.prisma.client.sender.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });

    if (senderExists) {
      throw new HttpException(
        'An user has already registered this sender',
        HttpStatus.CONFLICT,
      );
    }

    const sender = await this.prisma.client.sender.create({
      data: {
        username,
        email,
        domainId: domain.id,
        userId,
        name,
      },
      select: senderSelect,
    });

    return sender;
  }
}
