import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import moment from 'moment';
import { BlockPermissionService } from 'src/modules/user/services/block-permission.service';
import { PERMISSIONS } from 'src/auth/permissions';
import {
  BOUNCE_RATE_LIMIT,
  COMPLAINT_RATE_LIMIT,
  MIN_EMAILS_FOR_RATE_CALCULATION,
} from 'src/utils/constants';

@Injectable()
export class CheckUserEmailStatsService {
  constructor(
    private prisma: PrismaService,
    private blockPermissionService: BlockPermissionService,
  ) {}

  async execute(userId: string) {
    try {
      const fiveDaysAgo = moment().subtract(5, 'days').toDate();

      const totalSentMessages = await this.prisma.message.count({
        where: {
          userId,
          deletedAt: null,
          sentAt: {
            gte: fiveDaysAgo,
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
            gte: fiveDaysAgo,
          },
          status: 'bonce',
        },
      });

      const complaintCount = await this.prisma.message.count({
        where: {
          userId,
          deletedAt: null,
          sentAt: {
            gte: fiveDaysAgo,
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

        const emailSendingPermissions = [
          PERMISSIONS.SELF_SEND_EMAIL.value,
          PERMISSIONS.SELF_SEND_EMAIL_WITH_ATTACHMENTS.value,
          PERMISSIONS.SELF_CREATE_BULK_SENDING.value,
        ];

        for (const permission of emailSendingPermissions) {
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
