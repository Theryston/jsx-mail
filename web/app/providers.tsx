'use client';

import { NextUIProvider, Spinner } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Suspense } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
      <Suspense fallback={<Spinner />}>
        {children}
        <ToastContainer closeOnClick theme="dark" />
      </Suspense>
    </NextUIProvider>
  );
}
