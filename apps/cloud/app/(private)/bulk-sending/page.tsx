'use client';

import { useBulkSending } from '@/hooks/bulk-sending';
import { useEffect, useState } from 'react';
import { BulkSending } from '@/types/bulk-sending';

export default function BulkSendingPage() {
  const [page, setPage] = useState(1);
  const [processingBulkSending, setProcessingBulkSending] =
    useState<BulkSending | null>(null);
  const { data: bulkSendingPagination } = useBulkSending(
    { page },
    processingBulkSending ? 1000 : false,
  );

  useEffect(() => {
    if (!bulkSendingPagination) return;

    setProcessingBulkSending(
      bulkSendingPagination.bulkSendings.find((bulkSending) =>
        ['processing', 'pending'].includes(bulkSending.status),
      ) || null,
    );
  }, [bulkSendingPagination]);

  return (
    <div>
      <h1>Bulk sending</h1>
      <pre>{JSON.stringify(bulkSendingPagination, null, 2)}</pre>
    </div>
  );
}
