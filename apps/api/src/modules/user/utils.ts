import { Prisma } from '@prisma/client';
import moment from 'moment';

export function getFilterWhereMessages(
  {
    take,
    page,
    startDate,
    endDate,
    fromEmail,
    toEmail,
    statuses: statusesParam,
    bulkSending,
  }: any,
  userId: string,
) {
  let statuses: string[] = statusesParam ? JSON.parse(statusesParam) : [];

  if (endDate) {
    endDate = new Date(
      moment(endDate).add(2, 'day').endOf('day').format('YYYY-MM-DD'),
    );
  }
  if (startDate) {
    startDate = new Date(
      moment(startDate).add(1, 'day').startOf('day').format('YYYY-MM-DD'),
    );
  }

  let where: Prisma.MessageWhereInput = {
    userId,
    deletedAt: null,
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

  if (bulkSending) where.bulkSendingId = bulkSending;

  const skip = take * (page - 1);

  return {
    where,
    skip,
    take,
    page,
    endDate,
    startDate,
    fromEmail,
    toEmail,
    statuses,
  };
}
