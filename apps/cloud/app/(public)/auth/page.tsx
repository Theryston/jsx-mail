'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import handleRedirectUrl from '@/utils/handle-redirect-url';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/container';
import { useQueryClient } from '@tanstack/react-query';

export default function Auth() {
  const [redirect, setRedirect] = useState('' as string);
  const [token, setToken] = useState('' as string);
  const [sessionId, setSessionId] = useState('' as string);
  const [dots, setDots] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!redirect || !token) return;

    document.cookie = `token=${token}; path=/; max-age=604800;`;
    document.cookie = `sessionId=${sessionId}; path=/; max-age=604800;`;

    queryClient.invalidateQueries({ queryKey: ['me'] });
    router.push(redirect);
  }, [redirect, token, router, sessionId, queryClient]);

  useEffect(() => {
    setRedirect(handleRedirectUrl(searchParams));
    setToken(searchParams?.get('token') || '');
    setSessionId(searchParams?.get('sessionId') || '');
  }, [searchParams]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container anonymousHeader>
      <div className="w-full max-w-md mx-auto fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-4 items-center px-4 text-center">
        <h1 className="text-2xl font-bold">Authenticating{dots}</h1>
        <p className="text-muted-foreground text-xs animate-pulse">
          Please just await while we authenticate your account
        </p>
      </div>
    </Container>
  );
}
