import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class DeleteUserSettingsService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute(userId: string) {
    const userSettings = await this.prisma.client.userSettings.findFirst({
      where: { userId },
    });

    if (!userSettings) {
      return {
        message: 'User settings not found',
      };
    }

    await this.prisma.client.userSettings.delete({
      where: { id: userSettings.id },
    });

    return {
      message: 'User settings deleted successfully',
    };
  }
}
