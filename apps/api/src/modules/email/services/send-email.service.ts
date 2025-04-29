import { Inject, Injectable } from '@nestjs/common';
import { SendEmailDto, EmailPriority } from '../email.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class SendEmailService {
  constructor(
    @InjectQueue('email') private readonly sendEmailQueue: Queue,
    @Inject('prisma')
    private readonly prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async execute(data: SendEmailDto) {
    const priority = await this.getPriority(data.priority, data.userId);

    await this.sendEmailQueue.add('send-email', data, {
      attempts: 3,
      delay: data.delay,
      priority,
    });

    const newData = { ...data, priority };
    delete newData.html;
    console.log(
      `[SEND_EMAIL_SERVICE] added job to queue: ${JSON.stringify(newData)}`,
    );
  }

  async getPriority(priority: EmailPriority, userId: string) {
    const isUserPriority = await this.prisma.client.isUserPriority.findFirst({
      where: {
        userId,
      },
    });

    const weight = isUserPriority ? 0 : 10;

    if (priority === EmailPriority.HIGH) {
      return weight + 1;
    }

    return weight + 10;
  }
}
