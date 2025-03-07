'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/container';
import { useDeleteSession } from '@/hooks/user';
import { toast } from '@jsx-mail/ui/sonner';

export default function SignOut() {
  const [dots, setDots] = useState('');
  const router = useRouter();
  const { mutateAsync: deleteSession } = useDeleteSession();

  const performSignOut = useCallback(async () => {
    try {
      const sessionId = document.cookie
        .split('; ')
        .find((row) => row.startsWith('sessionId='))
        ?.split('=')[1];

      if (!sessionId) {
        toast.error('You are not signed in');
        router.push('/sign-in');
        return;
      }

      await deleteSession(sessionId);

      document.cookie = 'token=; path=/; max-age=0;';
      document.cookie = 'sessionId=; path=/; max-age=0;';

      toast.success('Signed out successfully');
      router.push('/sign-in');
    } catch (error) {
      router.push('/');
    }
  }, [deleteSession, router]);

  useEffect(() => {
    performSignOut();
  }, [performSignOut]);

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
        <h1 className="text-2xl font-bold">Signing out{dots}</h1>
        <p className="text-muted-foreground text-xs animate-pulse">
          Please wait while we sign you out
        </p>
      </div>
    </Container>
  );
}
