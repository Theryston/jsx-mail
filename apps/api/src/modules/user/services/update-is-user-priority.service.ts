import { Inject, Injectable } from '@nestjs/common';
import { UpdateUserPriorityDto } from '../user.dto';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class UpdateIsUserPriorityService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute(data: UpdateUserPriorityDto) {
    if (data.isUserPriority) {
      await this.prisma.client.isUserPriority.create({
        data: {
          userId: data.userId,
        },
      });
    } else {
      await this.prisma.client.isUserPriority.deleteMany({
        where: {
          userId: data.userId,
        },
      });
    }

    return {
      message: 'User priority updated',
    };
  }
}
