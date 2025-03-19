'use client';

import { ContactGroupListItem } from '@/types/bulk-sending';
import { ColumnDef } from '@tanstack/react-table';
import moment from 'moment';
import { Button } from '@jsx-mail/ui/button';
import { useState } from 'react';
import { DeleteConfirmationModal } from '@jsx-mail/ui/delete-confirmation-modal';
import { useDeleteContactGroup } from '@/hooks/bulk-sending';
import { toast } from '@jsx-mail/ui/sonner';
import { ChevronRightIcon, TrashIcon, UsersIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const columns: ColumnDef<ContactGroupListItem>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'contactsCount',
    header: 'Contacts',
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
      const contactGroup = row.original;
      const [isDeleteOpen, setIsDeleteOpen] = useState(false);
      const { mutateAsync: deleteContactGroup } = useDeleteContactGroup();
      const router = useRouter();

      const handleDelete = async (confirmationKey: string) => {
        try {
          await deleteContactGroup({ id: contactGroup.id, confirmationKey });
          toast.success('Contact group deleted successfully');
        } catch (error) {
          toast.error('Failed to delete contact group');
          console.error(error);
        }
      };

      const handleNavigateToContacts = () => {
        router.push(`/contacts/${contactGroup.id}`);
      };

      return (
        <>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleNavigateToContacts}
            >
              <UsersIcon className="size-4" />
              Contacts
            </Button>
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
            title="Delete Contact Group"
            description={`Are you sure you want to delete the contact group "${contactGroup.name}"? This action cannot be undone.`}
            confirmationKeyPlaceholder="Type the contact group name to confirm"
            expectedConfirmationKey={contactGroup.name}
          />
        </>
      );
    },
  },
];
