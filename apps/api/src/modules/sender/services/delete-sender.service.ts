import { CommunicationServiceManagementClient } from '@azure/arm-communication';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import azureCredential from 'src/config/azure-credential';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class DeleteSenderService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string, userId: string) {
    const senderWhere: Prisma.SenderWhereInput = {
      userId,
      deletedAt: {
        isSet: false,
      },
      domain: {
        deletedAt: {
          isSet: false,
        },
      },
    };

    const sender = await this.prisma.sender.findFirst({
      where: {
        id,
        ...senderWhere,
      },
      include: {
        domain: true,
      },
    });

    if (!sender)
      throw new HttpException('Sender not found', HttpStatus.NOT_FOUND);

    const otherSenders = await this.prisma.sender.count({
      where: {
        ...senderWhere,
        id: { not: sender.id },
      },
    });

    if (!otherSenders) {
      throw new HttpException(
        'You must have at least one sender',
        HttpStatus.BAD_REQUEST,
      );
    }

    const mgmtClient = new CommunicationServiceManagementClient(
      azureCredential,
      process.env.AZURE_SUBSCRIPTION_ID as string,
    );

    await mgmtClient.senderUsernames.delete(
      process.env.AZURE_RESOURCE_GROUP_NAME as string,
      process.env.AZURE_EMAIL_SERVICE_NAME as string,
      sender.domain.name,
      sender.username,
    );

    await this.prisma.sender.update({
      where: {
        id: sender.id,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return {
      message: 'Sender deleted',
    };
  }
}
