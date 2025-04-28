'use client';

import { BulkSending } from '@/types/bulk-sending';
import { ColumnDef } from '@tanstack/react-table';
import moment from 'moment';
import { Button } from '@jsx-mail/ui/button';
import { useEffect, useState } from 'react';
import {
  AlertCircleIcon,
  MailIcon,
  MoreHorizontalIcon,
  UsersIcon,
  RefreshCwIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Badge } from '@jsx-mail/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@jsx-mail/ui/dialog';
import { PaginationControls } from '@jsx-mail/ui/pagination-controls';
import {
  useBulkSendingFailures,
  useRestartBulkSending,
} from '@/hooks/bulk-sending';
import {
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@jsx-mail/ui/dropdown-menu';
import { DropdownMenu } from '@jsx-mail/ui/dropdown-menu';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@jsx-mail/ui/sonner';

export const columns: ColumnDef<BulkSending>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => {
      const bulkSending = row.original;
      return (
        <Link
          href={`/sending-history?page=1&startDate=${moment(bulkSending.createdAt).add(1, 'day').subtract(30, 'days').format('YYYY-MM-DD')}&endDate=${moment(bulkSending.createdAt).add(1, 'day').format('YYYY-MM-DD')}&bulkSending=${bulkSending.id}`}
          className="hover:underline"
        >
          {bulkSending.title}
        </Link>
      );
    },
  },
  {
    accessorKey: 'subject',
    header: 'Subject',
  },
  {
    accessorKey: 'totalContacts',
    header: 'Total contacts',
    cell: ({ row }) => {
      return (
        <Link
          href={`/contacts/${row.original.contactGroupId}?back=/bulk-sending`}
          className="hover:underline"
        >
          {row.original.totalContacts}
        </Link>
      );
    },
  },
  {
    accessorKey: 'messages',
    header: 'Sent messages',
    cell: ({ row }) => {
      return (
        <Link
          href={`/sending-history?page=1&startDate=${moment(row.original.createdAt).add(1, 'day').subtract(30, 'days').format('YYYY-MM-DD')}&endDate=${moment(row.original.createdAt).add(1, 'day').format('YYYY-MM-DD')}&bulkSending=${row.original.id}`}
          className="hover:underline"
        >
          {row.original._count.messages}
        </Link>
      );
    },
  },
  {
    accessorKey: 'failures',
    header: 'Failures',
    cell: ({ row }) => {
      return <span>{row.original._count.failures}</span>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;

      const statusClassname = {
        completed: '!bg-green-500/20 !text-green-500',
        failed: '!bg-red-500/20 !text-red-500',
        processing: '!bg-yellow-500/20 !text-yellow-500',
        pending: '!bg-blue-500/20 !text-blue-500',
      };

      return <Badge className={statusClassname[status]}>{status}</Badge>;
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
      const bulkSending = row.original;
      const router = useRouter();
      const [isErrorsDialogOpen, setIsErrorsDialogOpen] = useState(false);
      const [isRestartDialogOpen, setIsRestartDialogOpen] = useState(false);

      const handleViewMessages = () => {
        const url = `/sending-history?page=1&startDate=${moment(bulkSending.createdAt).add(1, 'day').subtract(30, 'days').format('YYYY-MM-DD')}&endDate=${moment(bulkSending.createdAt).add(1, 'day').format('YYYY-MM-DD')}&bulkSending=${bulkSending.id}`;
        console.log('url', url);
        router.push(url);
      };

      const handleViewContacts = () => {
        router.push(
          `/contacts/${bulkSending.contactGroupId}?back=/bulk-sending`,
        );
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontalIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleViewMessages}>
                <MailIcon className="size-4" />
                View Messages
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleViewContacts}>
                <UsersIcon className="size-4" />
                View Contacts
              </DropdownMenuItem>
              {bulkSending._count.failures > 0 && (
                <DropdownMenuItem onClick={() => setIsErrorsDialogOpen(true)}>
                  <AlertCircleIcon className="size-4" />
                  View Errors
                </DropdownMenuItem>
              )}
              {bulkSending.status === 'completed' && (
                <DropdownMenuItem onClick={() => setIsRestartDialogOpen(true)}>
                  <RefreshCwIcon className="size-4" />
                  Restart
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <ErrorsDialog
            isOpen={isErrorsDialogOpen}
            onOpenChange={setIsErrorsDialogOpen}
            bulkSendingId={bulkSending.id}
          />

          <RestartDialog
            isOpen={isRestartDialogOpen}
            onOpenChange={setIsRestartDialogOpen}
            bulkSending={bulkSending}
          />
        </>
      );
    },
  },
];

function RestartDialog({
  isOpen,
  onOpenChange,
  bulkSending,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  bulkSending: BulkSending;
}) {
  const { mutateAsync: restartBulkSending } = useRestartBulkSending();

  const handleRestart = async () => {
    try {
      await restartBulkSending(bulkSending.id);
      toast.success('Bulk sending restarted successfully');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to restart bulk sending');
    }
  };

  let remainingContacts =
    bulkSending.totalContacts - bulkSending._count.messages;

  if (remainingContacts < 0) remainingContacts = 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Restart Bulk Sending</DialogTitle>
          <DialogDescription>
            Are you sure you want to restart this bulk sending? This will
            attempt to send the email to all contacts that haven't received it
            yet.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm">
            <p className="font-medium">Details:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Total contacts: {bulkSending.totalContacts}</li>
              <li>Sent messages: {bulkSending._count.messages}</li>
              <li>Failed messages: {bulkSending._count.failures}</li>
              <li>Remaining contacts: {remainingContacts}</li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleRestart}>Restart</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ErrorsDialog({
  isOpen,
  onOpenChange,
  bulkSendingId,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  bulkSendingId: string;
}) {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const { data: failuresPagination, isPending } = useBulkSendingFailures(
    bulkSendingId,
    page,
  );

  useEffect(() => {
    if (!isOpen) return;

    // invalidate the query when the dialog is opened
    queryClient.invalidateQueries({
      queryKey: ['bulkSendingFailures', bulkSendingId],
    });
  }, [isOpen, bulkSendingId]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Sending Errors</DialogTitle>
        </DialogHeader>

        {isPending ? (
          <div className="flex justify-center py-4">
            <span className="text-muted-foreground">Loading...</span>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {failuresPagination?.failures.map((failure) => (
              <code
                key={failure.id}
                className="flex flex-col gap-1 p-2 rounded-md bg-zinc-900 overflow-auto"
              >
                {failure.line && (
                  <p className="text-xs">
                    <span className="font-bold">Line:</span> {failure.line}
                  </p>
                )}
                {failure.contactId && (
                  <p className="text-xs">
                    <span className="font-bold">Contact ID:</span>{' '}
                    {failure.contactId}
                  </p>
                )}
                <p className="text-xs">
                  {new Date(failure.createdAt).toLocaleString()}
                </p>
                <p className="text-xs">{failure.message}</p>
              </code>
            ))}

            {failuresPagination && failuresPagination.totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <PaginationControls
                  currentPage={page}
                  totalPages={failuresPagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}

            {failuresPagination?.failures.length === 0 && (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No errors found.</p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
