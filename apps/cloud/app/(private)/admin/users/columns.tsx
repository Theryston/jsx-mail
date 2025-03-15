'use client';

import { User } from '@/types/user';
import { ColumnDef } from '@tanstack/react-table';
import moment from 'moment';
import { Button } from '@jsx-mail/ui/button';
import { toast } from '@jsx-mail/ui/sonner';
import { ShieldIcon, BanIcon, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@jsx-mail/ui/dropdown-menu';
import { DropdownMenuTrigger } from '@jsx-mail/ui/dropdown-menu';

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    cell: ({ row }) => {
      return <span>{row.original.phone || 'N/A'}</span>;
    },
  },
  {
    accessorKey: 'isEmailVerified',
    header: 'Email Verified',
    cell: ({ row }) => {
      return <span>{row.original.isEmailVerified ? 'Yes' : 'No'}</span>;
    },
  },
  {
    accessorKey: 'accessLevel',
    header: 'Access Level',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      return <span>{moment(row.original.createdAt).format('DD/MM/YYYY')}</span>;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const user = row.original;

      const handleImpersonate = () => {
        toast.info(`Impersonating user: ${user.name}`);
        // Implement impersonation logic here
      };

      const handleBlock = () => {
        toast.info(`Blocking user: ${user.name}`);
        // Implement blocking logic here
      };

      return (
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="size-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleImpersonate}>
                <ShieldIcon className="size-4 mr-2" />
                Impersonate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleBlock}>
                <BanIcon className="size-4 mr-2" />
                Block
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
