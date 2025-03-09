'use client';

import { Message, Status } from '@/types/message';
import { ColumnDef } from '@tanstack/react-table';
import moment from 'moment';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@jsx-mail/ui/tooltip';

export const createColumns = (
  statuses: Status[] = [],
): ColumnDef<Message>[] => [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'sender.email',
    header: 'Sender',
  },
  {
    accessorKey: 'to',
    header: 'To',
  },
  {
    accessorKey: 'subject',
    header: 'Subject',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'sentAt',
    header: 'Sent At',
    cell: ({ row }) => {
      return <span>{moment(row.original.sentAt).format('DD MMM YY')}</span>;
    },
  },
];
