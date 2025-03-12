'use client';

import { useEffect } from 'react';

import { useVerifyDomain } from '@/hooks/domain';
import { Domain } from '@/types/domain';
import { useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import moment from 'moment';
import { toast } from '@jsx-mail/ui/sonner';

export function DomainStatus({ domain }: { domain: Domain }) {
  const [timeAgo, setTimeAgo] = useState<string>('');
  const intervalId = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();

  const { data: verifyDomain } = useVerifyDomain({
    id: domain.id,
    enabled: domain.status === 'pending',
  });

  useEffect(() => {
    if (!verifyDomain?.lastVerificationAt) return;
    if (intervalId.current) clearInterval(intervalId.current);

    setTimeAgo(moment(verifyDomain.lastVerificationAt).fromNow());

    intervalId.current = setInterval(() => {
      setTimeAgo(moment(verifyDomain.lastVerificationAt).fromNow());
    }, 1000);

    return () => {
      if (intervalId.current) clearInterval(intervalId.current);
    };
  }, [verifyDomain?.lastVerificationAt]);

  useEffect(() => {
    if (verifyDomain?.status === 'verified' && domain.status === 'pending') {
      queryClient.invalidateQueries({
        queryKey: ['domains'],
      });

      toast.success('Domain verified successfully');
    }
  }, [verifyDomain?.status, domain.status]);

  return (
    <span>
      {domain.status}{' '}
      {verifyDomain?.lastVerificationAt &&
        verifyDomain.status === 'pending' && (
          <>
            <br />
            <span className="text-xs text-gray-500">
              Last verified {timeAgo}
            </span>
          </>
        )}
    </span>
  );
}
