import { Injectable } from '@nestjs/common';
import { UpdateDefaultSettingsDto } from '../user.dto';
import { PrismaService } from 'src/services/prisma.service';
import { ResetQueueRateLimitService } from 'src/modules/email/services/reset-queue-rate-limit.service';

@Injectable()
export class UpdateDefaultSettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly resetQueueRateLimitService: ResetQueueRateLimitService,
  ) {}

  async execute(data: UpdateDefaultSettingsDto) {
    const prevDefaultSettings = await this.prisma.defaultSettings.findFirst();

    if (!prevDefaultSettings) {
      await this.prisma.defaultSettings.create({
        data,
      });
    } else {
      await this.prisma.defaultSettings.update({
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
