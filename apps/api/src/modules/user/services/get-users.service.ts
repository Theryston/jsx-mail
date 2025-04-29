import { Inject, Injectable } from '@nestjs/common';
import { GetUsersDto } from '../user.dto';
import { Prisma } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class GetUsersService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute(data: GetUsersDto) {
    const { search, take = 10, page = 1 } = data;
    const skip = take * (page - 1);

    const where: Prisma.UserWhereInput = {};

    if (search) {
      where.OR = [
        ...(where.OR || []),
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const users = await this.prisma.client.user.findMany({
      where,
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        isUserPriority: true,
        blockedPermissions: {
          where: {
            deletedAt: null,
          },
        },
        userUtm: {
          select: {
            utmName: true,
            utmValue: true,
          },
        },
        userUtmGroups: {
          select: {
            views: {
              select: {
                id: true,
                url: true,
              },
            },
          },
        },
      },
    });

    const count = await this.prisma.client.user.count({
      where,
    });

    return {
      users: users.map((u) => {
        delete u.password;
        return u;
      }),
      totalPages: Math.ceil(count / take),
      total: count,
      hasNext: skip + take < count,
    };
  }
}
