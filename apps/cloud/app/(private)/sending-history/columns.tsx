'use client';

import { Message } from '@/types/message';
import { ColumnDef } from '@tanstack/react-table';
import moment from 'moment';

export const columns: ColumnDef<Message>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'sender.email',
    header: 'Sender',
    cell: ({ row }) => {
      return <span>{row.original.sender?.email || 'Maybe deleted'}</span>;
    },
  },
  {
    accessorKey: 'to',
    header: 'To',
    cell: ({ row }) => {
      return <span>{row.original.to.join(', ')}</span>;
    },
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
      return (
        <span>
          {row.original.sentAt
            ? moment(row.original.sentAt).format('DD MMM YY')
            : 'N/A'}
        </span>
      );
    },
  },
];
