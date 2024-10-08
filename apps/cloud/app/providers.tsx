'use client';

import { NextUIProvider, Spinner } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Suspense, useEffect, useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [width, setWidth] = useState(0);
  const [showContent, setShowContent] = useState(true);

  useEffect(() => {
    setWidth(window.innerWidth);
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!width || typeof window === 'undefined') return;

    if (width > 1000) {
      setShowContent(true);
    } else {
      setShowContent(false);
    }
  }, [width]);

  return (
    <NextUIProvider navigate={router.push}>
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-screen w-full">
            <Spinner />
          </div>
        }
      >
        {showContent ? (
          children
        ) : (
          <div className="w-full h-screen flex justify-center items-center flex-col gap-2">
            <h1 className="text-2xl font-bold text-center">
              Not supported screen size
            </h1>
            <p className="text-center text-sm">
              Please use a screen with at least 1000px width
            </p>
          </div>
        )}
        <ToastContainer closeOnClick theme="dark" position="bottom-right" />
      </Suspense>
    </NextUIProvider>
  );
}
