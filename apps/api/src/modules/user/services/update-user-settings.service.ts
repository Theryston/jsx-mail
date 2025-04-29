import { Inject, Injectable } from '@nestjs/common';
import { UpdateUserSettingsDto } from '../user.dto';
import { GetSettingsService } from './get-settings.service';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class UpdateUserSettingsService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
    private readonly getSettingsService: GetSettingsService,
  ) {}

  async execute(userId: string, settings: UpdateUserSettingsDto) {
    let userSettings = await this.prisma.client.userSettings.findFirst({
      where: { userId },
    });

    if (!userSettings) {
      userSettings = await this.prisma.client.userSettings.create({
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

    await this.prisma.client.userSettings.update({
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
