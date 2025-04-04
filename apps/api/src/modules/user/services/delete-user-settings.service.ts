import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class DeleteUserSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string) {
    const userSettings = await this.prisma.userSettings.findFirst({
      where: { userId },
    });

    if (!userSettings) {
      return {
        message: 'User settings not found',
      };
    }

    await this.prisma.userSettings.delete({ where: { id: userSettings.id } });

    return {
      message: 'User settings deleted successfully',
    };
  }
}
