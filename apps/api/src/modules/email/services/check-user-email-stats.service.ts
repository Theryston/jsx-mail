import { Inject, Injectable } from '@nestjs/common';
import moment from 'moment';
import { BlockPermissionService } from 'src/modules/user/services/block-permission.service';
import { PERMISSIONS } from 'src/auth/permissions';
import { GetSettingsService } from 'src/modules/user/services/get-settings.service';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

const EMAIL_SENDING_PERMISSIONS = [
  PERMISSIONS.SELF_SEND_EMAIL.value,
  PERMISSIONS.SELF_CREATE_BULK_SENDING.value,
];

@Injectable()
export class CheckUserEmailStatsService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
    private blockPermissionService: BlockPermissionService,
    private getSettingsService: GetSettingsService,
  ) {}

  async execute(userId: string) {
    try {
      const settings = await this.getSettingsService.execute(userId);

      const lastSendingBlockedPermissionEvent =
        await this.prisma.client.blockedPermissionEvent.findFirst({
          where: {
            userId,
            style: 'block',
            permission: {
              in: EMAIL_SENDING_PERMISSIONS,
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

      let gapToCheckSecurityInsights = moment()
        .subtract(settings.gapToCheckSecurityInsights, 'days')
        .startOf('day')
        .toDate();

      if (lastSendingBlockedPermissionEvent) {
        const daysSinceLastBlock = moment().diff(
          lastSendingBlockedPermissionEvent.createdAt,
          'days',
        );

        if (daysSinceLastBlock < settings.gapToCheckSecurityInsights) {
          gapToCheckSecurityInsights =
            lastSendingBlockedPermissionEvent.createdAt;
        }
      }

      console.log(
        `[CHECK_USER_EMAIL_STATS] Checking user ${userId} in the last ${moment(gapToCheckSecurityInsights).format('DD/MM/YYYY')} days`,
      );

      const totalSentMessages = await this.prisma.client.message.count({
        where: {
          userId,
          deletedAt: null,
          sentAt: {
            gte: gapToCheckSecurityInsights,
          },
          status: {
            in: [
              'sent',
              'delivered',
              'opened',
              'clicked',
              'bounce',
              'complaint',
            ],
          },
        },
      });

      if (totalSentMessages < settings.minEmailsForRateCalculation) return;

      const bounceCount = await this.prisma.client.message.count({
        where: {
          userId,
          deletedAt: null,
          sentAt: {
            gte: gapToCheckSecurityInsights,
          },
          status: 'bounce',
        },
      });

      const complaintCount = await this.prisma.client.message.count({
        where: {
          userId,
          deletedAt: null,
          sentAt: {
            gte: gapToCheckSecurityInsights,
          },
          status: 'complaint',
        },
      });

      const bounceRate = bounceCount / totalSentMessages;
      const complaintRate = complaintCount / totalSentMessages;

      if (
        bounceRate > settings.bounceRateLimit ||
        complaintRate > settings.complaintRateLimit
      ) {
        console.log(
          `[CHECK_USER_EMAIL_STATS] Blocking user ${userId} due to high bounce rate (${(bounceRate * 100).toFixed(2)}%) or complaint rate (${(complaintRate * 100).toFixed(2)}%)`,
        );

        for (const permission of EMAIL_SENDING_PERMISSIONS) {
          await this.blockPermissionService.create({
            userId,
            permission,
            reason: `Account automatically blocked due to bounce rate (${(bounceRate * 100).toFixed(2)}%) or complaint rate (${(complaintRate * 100).toFixed(2)}%)`,
          });
        }

        const processingBulkSending =
          await this.prisma.client.bulkSending.findMany({
            where: {
              userId,
              status: 'processing',
            },
          });

        for (const bulkSending of processingBulkSending) {
          await this.prisma.client.bulkSending.update({
            where: { id: bulkSending.id },
            data: { status: 'failed' },
          });

          await this.prisma.client.bulkSendingFailure.create({
            data: {
              bulkSendingId: bulkSending.id,
              message: `Account automatically blocked due to bounce rate (${(bounceRate * 100).toFixed(2)}%) or complaint rate (${(complaintRate * 100).toFixed(2)}%)`,
            },
          });
        }

        console.log(
          `[CHECK_USER_EMAIL_STATS] Blocked ${processingBulkSending.length} bulk sending for user ${userId}`,
        );
      }
    } catch (error) {
      console.error('[CHECK_USER_EMAIL_STATS] Error:', error);
    }
  }
}
