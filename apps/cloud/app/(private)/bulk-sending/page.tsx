'use client';

import { Container } from '@/components/container';
import { Button } from '@jsx-mail/ui/button';
import { PlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useBulkSending } from '@/hooks/bulk-sending';
import { Skeleton } from '@jsx-mail/ui/skeleton';
import { useRouter } from 'next/navigation';
import { columns } from './columns';
import { DataTable } from './data-table';
import { PaginationControls } from '@jsx-mail/ui/pagination-controls';
import { BulkSending } from '@/types/bulk-sending';
import { cn } from '@jsx-mail/ui/lib/utils';
import { Loader2 } from 'lucide-react';

export default function BulkSendingPage() {
  const [page, setPage] = useState(1);
  const [processingBulkSending, setProcessingBulkSending] =
    useState<BulkSending | null>(null);
  const { data: bulkSendingPagination, isPending: isBulkSendingPending } =
    useBulkSending({ page }, processingBulkSending ? 5000 : false);
  const router = useRouter();

  useEffect(() => {
    if (!bulkSendingPagination) return;

    setProcessingBulkSending(
      bulkSendingPagination.bulkSendings.find((bulkSending) =>
        ['processing', 'pending'].includes(bulkSending.status),
      ) || null,
    );
  }, [bulkSendingPagination]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleCreateBulkSending = () => {
    router.push('/bulk-sending/create');
  };

  return (
    <Container header>
      <div className="flex flex-col gap-4">
        {processingBulkSending && (
          <div
            className={cn(
              'rounded-md p-4 flex flex-col md:flex-row justify-between md:items-center gap-2',
              'bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse',
            )}
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                <p className="text-sm">
                  Processing bulk sending: {processingBulkSending.title}
                </p>
              </div>
              <p className="text-xs">
                {processingBulkSending.processedContacts}/
                {processingBulkSending.totalContacts} contacts processed
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <h1 className="text-2xl">
            <span className="font-bold">Bulk</span> Sendings
          </h1>

          <Button size="icon" onClick={handleCreateBulkSending}>
            <PlusIcon className="size-4" />
          </Button>
        </div>

        {isBulkSendingPending ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <div className="rounded-xl bg-zinc-900 p-4 w-full">
            <DataTable
              columns={columns}
              data={bulkSendingPagination?.bulkSendings || []}
            />
          </div>
        )}

        {bulkSendingPagination && bulkSendingPagination.totalPages > 1 && (
          <div className="flex justify-center">
            <PaginationControls
              currentPage={page}
              totalPages={bulkSendingPagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </Container>
  );
}
