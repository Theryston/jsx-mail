import { Injectable } from '@nestjs/common';
import { sessionSelect } from 'src/utils/public-selects';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import { Inject } from '@nestjs/common';

@Injectable()
export class ListSessionsService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute(userId: string) {
    const sessions = await this.prisma.client.session.findMany({
      where: {
        AND: [
          {
            deletedAt: null,
            userId,
            impersonateUserId: null,
          },
          {
            OR: [
              {
                expiresAt: {
                  gte: new Date(),
                },
              },
              {
                expiresAt: null,
              },
            ],
          },
        ],
      },
      select: sessionSelect,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return sessions;
  }
}
