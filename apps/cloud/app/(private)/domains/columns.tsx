'use client';

import { Domain } from '@/types/domain';
import { ColumnDef } from '@tanstack/react-table';
import moment from 'moment';
import { Button } from '@jsx-mail/ui/button';
import { useState } from 'react';
import { ViewDNSModal } from './view-dns-modal';
import { DeleteConfirmationModal } from '@jsx-mail/ui/delete-confirmation-modal';
import { useDeleteDomain } from '@/hooks/domain';
import { toast } from '@jsx-mail/ui/sonner';
import { ClockIcon, EyeIcon, TrashIcon, MoreHorizontal } from 'lucide-react';
import { DomainStatus } from '@/components/domain-status';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@jsx-mail/ui/dropdown-menu';

export const columns: ColumnDef<Domain>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const domain = row.original;

      return <DomainStatus domain={domain} />;
    },
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
      const domain = row.original;
      const [isViewDNSOpen, setIsViewDNSOpen] = useState(false);
      const [isDeleteOpen, setIsDeleteOpen] = useState(false);
      const { mutateAsync: deleteDomain } = useDeleteDomain();

      const handleDelete = async (confirmationKey: string) => {
        try {
          await deleteDomain({ id: domain.id, confirmationKey });
          toast.success('Domain deleted successfully');
        } catch (error) {
          toast.error('Failed to delete domain');
          console.error(error);
        }
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={
                  domain.status !== 'verified'
                    ? 'bg-amber-500/10 text-amber-500 hover:!bg-amber-500/20 hover:!text-amber-500 !border-none'
                    : ''
                }
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setIsViewDNSOpen(true)}
                className={
                  domain.status !== 'verified'
                    ? 'bg-amber-500/10 text-amber-500 hover:!bg-amber-500/20 hover:!text-amber-500'
                    : ''
                }
              >
                {domain.status === 'verified' ? (
                  <>
                    <EyeIcon className="size-4" />
                    View DNS
                  </>
                ) : (
                  <>
                    <ClockIcon className="size-4 text-amber-500" />
                    Verify
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsDeleteOpen(true)}>
                <TrashIcon className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ViewDNSModal
            isOpen={isViewDNSOpen}
            onClose={() => setIsViewDNSOpen(false)}
            domain={domain}
          />

          <DeleteConfirmationModal
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            onConfirm={handleDelete}
            title="Delete Domain"
            description={`Are you sure you want to delete the domain "${domain.name}"? This action cannot be undone.`}
            confirmationKeyPlaceholder="Type the domain name to confirm"
            expectedConfirmationKey={domain.name}
          />
        </>
      );
    },
  },
];
