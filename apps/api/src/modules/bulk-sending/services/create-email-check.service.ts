import { Inject, Injectable } from '@nestjs/common';
import {
  EmailCheckLevel,
  EmailCheckStatus,
  EmailCheckResult,
  PrismaClient,
} from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
@Injectable()
export class CreateEmailCheckService {
  constructor(
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

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

    return await this.prisma.client.emailCheck.create({
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
