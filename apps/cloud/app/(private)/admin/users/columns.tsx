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
import { useImpersonateUser } from '@/hooks/user';
import handleRedirectUrl from '@/utils/handle-redirect-url';
import { useRouter, useSearchParams } from 'next/navigation';

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
      const { mutateAsync: impersonateUser } = useImpersonateUser();
      const searchParams = useSearchParams();
      const router = useRouter();

      const handleImpersonate = async () => {
        const id = toast.loading('Impersonating user...');

        try {
          const impersonatedSession = await impersonateUser({
            userId: user.id,
          });

          const redirectUrlString = handleRedirectUrl(searchParams);
          const redirectUrlObj = new URL(redirectUrlString);
          redirectUrlObj.searchParams.append(
            'sessionId',
            impersonatedSession.sessionId,
          );
          redirectUrlObj.searchParams.append(
            'token',
            impersonatedSession.token,
          );

          const redirectUrl = redirectUrlObj.toString();

          toast.success('User impersonated successfully', { id });
          router.push(redirectUrl);
        } catch (error) {
          toast.error('Failed to impersonate user', { id });
        }
      };

      const handleBlock = () => {
        toast.info('Not implemented yet');
        // Implement blocking logic here
      };

      return (
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleImpersonate}>
                <ShieldIcon className="size-4" />
                Impersonate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleBlock}>
                <BanIcon className="size-4" />
                Block
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
