import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import {
  EmailCheckLevel,
  EmailCheckStatus,
  EmailCheckResult,
} from '@prisma/client';

@Injectable()
export class CreateEmailCheckService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    {
      email,
      bulkEmailCheckId,
      contactId,
      level,
      status,
      result,
    }: {
      email: string;
      bulkEmailCheckId?: string;
      contactId?: string;
      level?: EmailCheckLevel;
      status?: EmailCheckStatus;
      result?: EmailCheckResult;
    },
    userId: string,
  ) {
    if (!level) level = 'valid';

    return await this.prisma.emailCheck.create({
      data: {
        email,
        status,
        result,
        bulkEmailCheckId,
        contactId,
        userId,
        level,
      },
    });
  }
}
