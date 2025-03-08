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
          <div className="flex gap-2">
            <Button
              variant={domain.status === 'pending' ? 'pending' : 'outline'}
              size="sm"
              onClick={() => setIsViewDNSOpen(true)}
            >
              {domain.status === 'verified' ? 'View DNS' : 'Verify'}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteOpen(true)}
            >
              Delete
            </Button>
          </div>

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
