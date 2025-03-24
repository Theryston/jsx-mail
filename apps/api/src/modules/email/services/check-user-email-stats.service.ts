import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import moment from 'moment';
import { BlockPermissionService } from 'src/modules/user/services/block-permission.service';
import { PERMISSIONS } from 'src/auth/permissions';
import {
  BOUNCE_RATE_LIMIT,
  COMPLAINT_RATE_LIMIT,
  GAP_TO_CHECK_SECURITY_INSIGHTS,
  MIN_EMAILS_FOR_RATE_CALCULATION,
} from 'src/utils/constants';

const EMAIL_SENDING_PERMISSIONS = [
  PERMISSIONS.SELF_SEND_EMAIL.value,
  PERMISSIONS.SELF_CREATE_BULK_SENDING.value,
];

@Injectable()
export class CheckUserEmailStatsService {
  constructor(
    private prisma: PrismaService,
    private blockPermissionService: BlockPermissionService,
  ) {}

  async execute(userId: string) {
    try {
      const lastSendingBlockedPermissionEvent =
        await this.prisma.blockedPermissionEvent.findFirst({
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
        .subtract(GAP_TO_CHECK_SECURITY_INSIGHTS, 'days')
        .startOf('day')
        .toDate();

      if (lastSendingBlockedPermissionEvent) {
        const daysSinceLastBlock = moment().diff(
          lastSendingBlockedPermissionEvent.createdAt,
          'days',
        );

        if (daysSinceLastBlock < GAP_TO_CHECK_SECURITY_INSIGHTS) {
          gapToCheckSecurityInsights =
            lastSendingBlockedPermissionEvent.createdAt;
        }
      }

      console.log(
        `[CHECK_USER_EMAIL_STATS] Checking user ${userId} in the last ${moment(gapToCheckSecurityInsights).format('DD/MM/YYYY')} days`,
      );

      const totalSentMessages = await this.prisma.message.count({
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
              'bonce',
              'complaint',
            ],
          },
        },
      });

      if (totalSentMessages < MIN_EMAILS_FOR_RATE_CALCULATION) return;

      const bounceCount = await this.prisma.message.count({
        where: {
          userId,
          deletedAt: null,
          sentAt: {
            gte: gapToCheckSecurityInsights,
          },
          status: 'bonce',
        },
      });

      const complaintCount = await this.prisma.message.count({
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
        bounceRate > BOUNCE_RATE_LIMIT ||
        complaintRate > COMPLAINT_RATE_LIMIT
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

        const processingBulkSending = await this.prisma.bulkSending.findMany({
          where: {
            userId,
            status: 'processing',
          },
        });

        for (const bulkSending of processingBulkSending) {
          await this.prisma.bulkSending.update({
            where: { id: bulkSending.id },
            data: { status: 'failed' },
          });

          await this.prisma.bulkSendingFailure.create({
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
