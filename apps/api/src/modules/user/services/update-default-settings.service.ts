import { Inject, Injectable } from '@nestjs/common';
import { UpdateDefaultSettingsDto } from '../user.dto';
import { ResetQueueRateLimitService } from 'src/modules/email/services/reset-queue-rate-limit.service';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class UpdateDefaultSettingsService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
    private readonly resetQueueRateLimitService: ResetQueueRateLimitService,
  ) {}

  async execute(data: UpdateDefaultSettingsDto) {
    const prevDefaultSettings =
      await this.prisma.client.defaultSettings.findFirst();

    if (!prevDefaultSettings) {
      await this.prisma.client.defaultSettings.create({
        data,
      });
    } else {
      await this.prisma.client.defaultSettings.update({
        where: { id: prevDefaultSettings.id },
        data,
      });

      if (
        prevDefaultSettings.globalMaxMessagesPerDay !==
          data.globalMaxMessagesPerDay ||
        prevDefaultSettings.globalMaxMessagesPerSecond !==
          data.globalMaxMessagesPerSecond
      ) {
        await this.resetQueueRateLimitService.execute();
      }
    }

    return {
      message: 'Default settings updated successfully',
    };
  }
}
