'use client';

import { File } from '@/types/file';
import { ColumnDef } from '@tanstack/react-table';
import moment from 'moment';
import { Button } from '@jsx-mail/ui/button';
import { useState } from 'react';
import { DeleteConfirmationModal } from '@jsx-mail/ui/delete-confirmation-modal';
import { useDeleteFile } from '@/hooks/file';
import { toast } from '@jsx-mail/ui/sonner';
import { formatSize } from '@/utils/format';
import { DownloadIcon, TrashIcon, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@jsx-mail/ui/dropdown-menu';

export const columns: ColumnDef<File>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'originalName',
    header: 'Name',
  },
  {
    accessorKey: 'size',
    header: 'Size',
    cell: ({ row }) => {
      return <span>{formatSize(row.original.size)}</span>;
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
      const file = row.original;
      const [isDeleteOpen, setIsDeleteOpen] = useState(false);
      const { mutateAsync: deleteFile } = useDeleteFile();

      const handleDelete = async (confirmationKey: string) => {
        try {
          await deleteFile({ id: file.id, confirmationKey });
          toast.success('File deleted successfully');
        } catch (error) {
          toast.error('Failed to delete file');
          console.error(error);
        }
      };

      const handleDownload = () => {
        window.open(file.url, '_blank');
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
              <DropdownMenuItem onClick={handleDownload}>
                <DownloadIcon className="size-4" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsDeleteOpen(true)}>
                <TrashIcon className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DeleteConfirmationModal
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            onConfirm={handleDelete}
            title="Delete File"
            description={`Are you sure you want to delete the file "${file.originalName}"? This action cannot be undone.`}
            confirmationKeyPlaceholder="Type the file name to confirm"
            expectedConfirmationKey={file.originalName}
          />
        </>
      );
    },
  },
];
