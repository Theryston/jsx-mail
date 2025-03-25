import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { GetUsersDto } from '../user.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class GetUsersService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(data: GetUsersDto) {
    const { search, take = 10, page = 1 } = data;
    const skip = take * (page - 1);

    const where: Prisma.UserWhereInput = {};

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const users = await this.prisma.user.findMany({
      where,
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
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
      },
    });

    const count = await this.prisma.user.count({
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
