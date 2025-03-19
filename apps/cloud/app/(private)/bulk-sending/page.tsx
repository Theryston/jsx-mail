'use client';

import { useBulkSending } from '@/hooks/bulk-sending';

export default function BulkSendingPage() {
  const { data: bulkSendings } = useBulkSending();

  return (
    <div>
      <h1>Bulk sending</h1>
      <pre>{JSON.stringify(bulkSendings, null, 2)}</pre>
    </div>
  );
}
