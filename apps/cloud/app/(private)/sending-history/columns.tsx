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
    cell: ({ row }) => {
      const status = row.original.status;
      const statusInfo = statuses.find((s) => s.value === status);

      if (!statusInfo) {
        return <span>{status}</span>;
      }

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{statusInfo.label}</TooltipTrigger>
            <TooltipContent>
              <p>{statusInfo.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: 'sentAt',
    header: 'Sent At',
    cell: ({ row }) => {
      return <span>{moment(row.original.sentAt).format('DD MMM YY')}</span>;
    },
  },
];
