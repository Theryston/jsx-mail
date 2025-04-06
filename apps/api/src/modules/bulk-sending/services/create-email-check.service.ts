import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { EMAIL_CHECK_ATTEMPTS, EMAIL_CHECK_DELAY } from 'src/utils/constants';
import { EmailCheckLevel } from '@prisma/client';

@Injectable()
export class CreateEmailCheckService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('email-check') private readonly emailCheckQueue: Queue,
  ) {}

  async execute(
    {
      email,
      bulkEmailCheckId,
      contactId,
      level,
    }: {
      email: string;
      bulkEmailCheckId?: string;
      contactId?: string;
      level?: EmailCheckLevel;
    },
    userId: string,
  ) {
    if (!level) level = 'valid';

    const emailCheck = await this.prisma.emailCheck.create({
      data: {
        email,
        status: 'pending',
        result: 'unknown',
        bulkEmailCheckId,
        contactId,
        userId,
        level,
      },
    });

    const randomPriority = Math.floor(Math.random() * 10) + 1;

    await this.emailCheckQueue.add(
      'email-check',
      {
        emailCheckId: emailCheck.id,
      },
      {
        priority: randomPriority,
        attempts: EMAIL_CHECK_ATTEMPTS,
        backoff: {
          type: 'fixed',
          delay: EMAIL_CHECK_DELAY,
        },
      },
    );
  }
}
