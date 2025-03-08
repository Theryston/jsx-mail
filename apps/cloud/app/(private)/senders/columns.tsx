'use client';

import { Sender } from '@/types/sender';
import { ColumnDef } from '@tanstack/react-table';
import moment from 'moment';
import { Button } from '@jsx-mail/ui/button';
import { useState } from 'react';
import { DeleteConfirmationModal } from '@jsx-mail/ui/delete-confirmation-modal';
import { useDeleteSender } from '@/hooks/sender';
import { toast } from '@jsx-mail/ui/sonner';

export const columns: ColumnDef<Sender>[] = [
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
      const sender = row.original;
      const [isDeleteOpen, setIsDeleteOpen] = useState(false);
      const { mutateAsync: deleteSender } = useDeleteSender();

      const handleDelete = async (confirmationKey: string) => {
        try {
          await deleteSender({ id: sender.id, confirmationKey });
          toast.success('Sender deleted successfully');
        } catch (error) {
          toast.error('Failed to delete sender');
          console.error(error);
        }
      };

      return (
        <>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteOpen(true)}
            >
              Delete
            </Button>
          </div>

          <DeleteConfirmationModal
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            onConfirm={handleDelete}
            title="Delete Sender"
            description={`Are you sure you want to delete the sender "${sender.email}"? This action cannot be undone.`}
            confirmationKeyPlaceholder="Type the email to confirm"
            expectedConfirmationKey={sender.email}
          />
        </>
      );
    },
  },
];
