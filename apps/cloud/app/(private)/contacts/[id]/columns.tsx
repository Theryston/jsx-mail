'use client';

import { ContactListItem } from '@/types/bulk-sending';
import { ColumnDef } from '@tanstack/react-table';
import moment from 'moment';
import { Button } from '@jsx-mail/ui/button';
import { useState } from 'react';
import { DeleteConfirmationModal } from '@jsx-mail/ui/delete-confirmation-modal';
import { useDeleteContactGroupContact } from '@/hooks/bulk-sending';
import { toast } from '@jsx-mail/ui/sonner';
import { MoreHorizontal, TrashIcon } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@jsx-mail/ui/dropdown-menu';

export const columns = (
  contactGroupId: string,
): ColumnDef<ContactListItem>[] => [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      return <span>{row.original.name || 'N/A'}</span>;
    },
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsDeleteOpen(true)}>
                <TrashIcon className="size-4" />
                Delete Contact
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DeleteConfirmationModal
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            onConfirm={handleDelete}
            title="Delete Contact"
            description={`Are you sure you want to delete the contact "${contact.name} (${contact.email})"? This action cannot be undone.`}
            confirmationKeyPlaceholder={`Type "${contact.email}" to confirm`}
            expectedConfirmationKey={contact.email}
          />
        </>
      );
    },
  },
];
