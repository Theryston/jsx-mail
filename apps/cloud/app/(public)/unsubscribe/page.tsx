'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@jsx-mail/ui/button';
import { toast } from '@jsx-mail/ui/sonner';
import { useContactExists, useContactUnsubscribe } from '@/hooks/bulk-sending';

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const key = searchParams.get('key');
  const router = useRouter();
  const { mutateAsync: unsubscribe, isPending } = useContactUnsubscribe();
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);
  const { data: contactExists } = useContactExists(key);

  const handleUnsubscribe = useCallback(async () => {
    if (!key) {
      toast.error('There was an error unsubscribing');
      return;
    }

    await unsubscribe(key);
    setIsUnsubscribed(true);
  }, [key]);

  useEffect(() => {
    setIsUnsubscribed(contactExists && !contactExists.exists);
  }, [contactExists]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center max-w-md w-full mx-auto">
      <h1 className="text-2xl font-bold">Unsubscribe</h1>
      {isUnsubscribed ? (
        <p className="text-sm text-gray-500">You have been unsubscribed!</p>
      ) : (
        <>
          <p className="text-sm text-gray-500">
            Are you sure you want to unsubscribe?
          </p>
          <div className="grid grid-cols-2 gap-2 w-full mt-6">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="w-full"
              disabled={isPending}
            >
              Back
            </Button>
            <Button
              onClick={() => handleUnsubscribe()}
              className="w-full"
              disabled={isPending}
            >
              {isPending ? 'Unsubscribing...' : 'Unsubscribe'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
