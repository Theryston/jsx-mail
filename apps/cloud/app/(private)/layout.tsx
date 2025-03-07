'use client';

import { useMe } from '@/hooks/user';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: me, error, isPending } = useMe();
  const router = useRouter();

  if (isPending) return <Loading />;

  if (!me) {
    router.push('/sign-in');
    return null;
  }

  if (error) {
    router.push('/sign-in');
    return null;
  }

  return <main>{children}</main>;
}

function Loading() {
  const [dots, setDots] = useState('');

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
    <div className="w-full max-w-md mx-auto fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-4 items-center px-4 text-center">
      <h1 className="text-2xl font-bold">Loading{dots}</h1>
      <p className="text-muted-foreground text-xs animate-pulse">
        Please wait while we load your data
      </p>
    </div>
  );
}
