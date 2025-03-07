'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import handleRedirectUrl from '@/utils/handle-redirect-url';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/container';
import { useQueryClient } from '@tanstack/react-query';
import { useValidateEmail } from '@/hooks/user';
import { toast } from '@jsx-mail/ui/sonner';

export default function VerifyEmail() {
  const [redirect, setRedirect] = useState('' as string);
  const [dots, setDots] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync: validateEmail } = useValidateEmail();

  const verifyEmail = useCallback(async () => {
    if (!redirect) return;

    try {
      const { data } = await validateEmail();

      let redirectUrl: URL | string = new URL(redirect);
      redirectUrl.searchParams.append('token', data.token);
      redirectUrl.searchParams.append('sessionId', data.sessionId);
      redirectUrl = redirectUrl.toString();

      document.cookie = `token=${data.token}; path=/; max-age=604800;`;
      document.cookie = `sessionId=${data.sessionId}; path=/; max-age=604800;`;

      queryClient.invalidateQueries({ queryKey: ['me'] });
      router.push(redirectUrl);
    } catch (error: any) {
      router.push('/sign-up');
    }
  }, [redirect, router, validateEmail, queryClient]);

  useEffect(() => {
    setRedirect(handleRedirectUrl(searchParams));
  }, [searchParams]);

  useEffect(() => {
    verifyEmail();
  }, [verifyEmail]);

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
        <h1 className="text-2xl font-bold">Verifying email{dots}</h1>
        <p className="text-muted-foreground text-xs animate-pulse">
          Please wait while we verify your email
        </p>
      </div>
    </Container>
  );
}
