import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { CreateUtmDto } from '../user.dto';

@Injectable()
export class CreateUtmOrViewService {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ userUtmGroupId, url, utms }: CreateUtmDto) {
    if (!userUtmGroupId && !utms.length) {
      throw new BadRequestException(
        'If userUtmGroupId is not provided, utms must be provided',
      );
    }

    if (!userUtmGroupId) {
      const group = await this.prisma.userUtmGroup.create({
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

    const group = await this.prisma.userUtmGroup.findUnique({
      where: {
        id: userUtmGroupId,
      },
    });

    if (!group) {
      throw new BadRequestException('UserUtmGroup not found');
    }

    await this.prisma.userUtmGroupView.create({
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
