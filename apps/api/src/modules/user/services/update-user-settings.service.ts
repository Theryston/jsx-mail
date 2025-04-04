import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { UpdateUserSettingsDto } from '../user.dto';
import { GetSettingsService } from './get-settings.service';

@Injectable()
export class UpdateUserSettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly getSettingsService: GetSettingsService,
  ) {}

  async execute(userId: string, settings: UpdateUserSettingsDto) {
    let userSettings = await this.prisma.userSettings.findFirst({
      where: { userId },
    });

    if (!userSettings) {
      userSettings = await this.prisma.userSettings.create({
        data: {
          userId,
        },
      });
    }

    const defaultSettings = await this.getSettingsService.getDefaultSettings();

    const changedContent: UpdateUserSettingsDto = {};

    for (const key in settings) {
      if (userSettings[key] === defaultSettings[key]) {
        changedContent[key] = null;
      } else if (settings[key] !== userSettings[key]) {
        changedContent[key] = settings[key];
      }
    }

    await this.prisma.userSettings.update({
      where: { id: userSettings.id },
      data: {
        ...changedContent,
      },
    });

    return {
      message: 'User settings updated successfully',
      changedContent,
    };
  }
}
