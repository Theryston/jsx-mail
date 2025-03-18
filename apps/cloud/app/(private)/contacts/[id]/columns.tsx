'use client';

import { ContactListItem } from '@/types/contact-group';
import { ColumnDef } from '@tanstack/react-table';
import moment from 'moment';
import { Button } from '@jsx-mail/ui/button';
import { useState } from 'react';
import { DeleteConfirmationModal } from '@jsx-mail/ui/delete-confirmation-modal';
import { useDeleteContactGroupContact } from '@/hooks/contact-group';
import { toast } from '@jsx-mail/ui/sonner';
import { TrashIcon } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export const columns = (
  contactGroupId: string,
): ColumnDef<ContactListItem>[] => [
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
      const contact = row.original;
      const [isDeleteOpen, setIsDeleteOpen] = useState(false);
      const { mutateAsync: deleteContact } = useDeleteContactGroupContact();
      const queryClient = useQueryClient();

      const handleDelete = async () => {
        try {
          await deleteContact({ id: contactGroupId, contactId: contact.id });
          toast.success('Contact deleted successfully');
          queryClient.invalidateQueries({
            queryKey: ['contactGroupContacts', contactGroupId],
          });
          queryClient.invalidateQueries({
            queryKey: ['contactGroup', contactGroupId],
          });
        } catch (error) {
          toast.error('Failed to delete contact');
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
              <TrashIcon className="size-4" />
              Delete
            </Button>
          </div>

          <DeleteConfirmationModal
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            onConfirm={handleDelete}
            title="Delete Contact"
            description={`Are you sure you want to delete the contact "${contact.name} (${contact.email})"? This action cannot be undone.`}
            confirmationKeyPlaceholder="Type DELETE to confirm"
            expectedConfirmationKey="DELETE"
          />
        </>
      );
    },
  },
];
