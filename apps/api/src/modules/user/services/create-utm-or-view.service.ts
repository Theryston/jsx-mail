import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUtmDto } from '../user.dto';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import { Inject } from '@nestjs/common';

@Injectable()
export class CreateUtmOrViewService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute({ userUtmGroupId, url, utms }: CreateUtmDto) {
    if (!userUtmGroupId && !utms.length) {
      throw new BadRequestException(
        'If userUtmGroupId is not provided, utms must be provided',
      );
    }

    if (!userUtmGroupId) {
      const group = await this.prisma.client.userUtmGroup.create({
        data: {
          utms: {
            createMany: {
              data: utms.map((utm) => ({
                utmName: utm.utmName,
                utmValue: utm.utmValue,
              })),
            },
          },
        },
      });

      userUtmGroupId = group.id;
    }

    const group = await this.prisma.client.userUtmGroup.findUnique({
      where: {
        id: userUtmGroupId,
      },
    });

    if (!group) {
      throw new BadRequestException('UserUtmGroup not found');
    }

    await this.prisma.client.userUtmGroupView.create({
      data: {
        groupId: group.id,
        url,
      },
    });

    return {
      message: 'UTM group view created successfully',
      userUtmGroupId: group.id,
    };
  }
}
