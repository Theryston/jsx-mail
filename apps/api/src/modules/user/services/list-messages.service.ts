import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { messageSelect } from 'src/utils/public-selects';
import { ListMessagesDto } from '../user.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ListMessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    {
      take,
      page,
      startDate,
      endDate,
      fromEmail,
      toEmail,
      statuses: statusesParam,
    }: ListMessagesDto,
    userId: string,
  ) {
    let statuses: string[] = statusesParam ? JSON.parse(statusesParam) : [];

    const skip = take * (page - 1);
    let where: Prisma.MessageWhereInput = {
      userId,
      deletedAt: {
        isSet: false,
      },
    };

    if (endDate)
      where.createdAt = { ...(where.createdAt as any), lte: endDate } as any;
    if (startDate)
      where.createdAt = { ...(where.createdAt as any), gte: startDate } as any;

    if (fromEmail) where.sender = { ...where.sender, email: fromEmail } as any;
    if (toEmail)
      where.to = {
        ...where.to,
        equals: [...((where.to?.equals || []) as any), toEmail],
      } as any;

    if (statuses.length)
      where.status = { ...(where.status as any), in: statuses as any } as any;

    let messages = await this.prisma.message.findMany({
      where,
      select: {
        ...messageSelect,
        sender: {
          select: {
            email: true,
          },
        },
      },
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const count = await this.prisma.message.count({ where });

    return {
      messages,
      take,
      page,
      skip,
      total: count,
      endDate,
      startDate,
      fromEmail,
      toEmail,
      statuses,
      hasNext: skip + take < count,
      totalPages: Math.ceil(count / take),
    };
  }
}
