import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { UpdateUserPriorityDto } from '../user.dto';

@Injectable()
export class UpdateIsUserPriorityService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(data: UpdateUserPriorityDto) {
    if (data.isUserPriority) {
      await this.prisma.isUserPriority.create({
        data: {
          userId: data.userId,
        },
      });
    } else {
      await this.prisma.isUserPriority.deleteMany({
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
