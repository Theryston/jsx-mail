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
      let daysToCheck = GAP_TO_CHECK_SECURITY_INSIGHTS;

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

      if (lastSendingBlockedPermissionEvent) {
        const daysSinceLastBlock = moment().diff(
          lastSendingBlockedPermissionEvent.createdAt,
          'days',
        );

        daysToCheck = Math.min(
          GAP_TO_CHECK_SECURITY_INSIGHTS,
          daysSinceLastBlock,
        );
      }

      console.log(
        `[CHECK_USER_EMAIL_STATS] Checking user ${userId} in the last ${daysToCheck} days`,
      );

      const gapToCheckSecurityInsights = moment()
        .subtract(daysToCheck, 'days')
        .toDate();

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
            reason: `Account automatically blocked due to bounce rate (${(bounceRate * 100).toFixed(2)}%) or complaint rate (${(complaintRate * 100).toFixed(2)}%) above the limit in the last 5 days.`,
          });
        }
      }
    } catch (error) {
      console.error('[CHECK_USER_EMAIL_STATS] Error:', error);
    }
  }
}
