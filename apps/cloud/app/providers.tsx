/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { toast, Toaster } from '@jsx-mail/ui/sonner';
import { ThemeProvider } from '@jsx-mail/ui/theme';
import { Suspense } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { useState, useEffect } from 'react';
import { Crisp } from 'crisp-sdk-web';
import { useSearchParams } from 'next/navigation';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <ThemeProvider>
        <ProgressBar
          height="2px"
          color="#fff"
          options={{ showSpinner: false }}
        />

        <QueryClientProvider>
          <UTMProvider>
            <CrispProvider>
              <TurnstileProvider>{children}</TurnstileProvider>
            </CrispProvider>
          </UTMProvider>
        </QueryClientProvider>
        <Toaster />
      </ThemeProvider>
    </Suspense>
  );
}

function TurnstileProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onloadTurnstileCallback"
        defer
      />
      {children}
    </>
  );
}

function CrispProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    Crisp.configure(process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID || '');
  }, []);

  useEffect(() => {
    const support = searchParams.get('support') === 'true';
    if (!support) return;

    Crisp.chat.open();
  }, [searchParams]);

  return <>{children}</>;
}

function UTMProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const utmParams: Record<string, string> = {};

    searchParams.forEach((value, key) => {
      if (key.startsWith('utm_')) {
        utmParams[key] = value;
      }
    });

    if (Object.keys(utmParams).length > 0) {
      localStorage.setItem('utm_params', JSON.stringify(utmParams));
    }
  }, [searchParams]);

  return <>{children}</>;
}

function QueryClientProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          mutations: {
            onError(error: any) {
              const message =
                error?.message || error?.error || 'Something went wrong';

              toast.error(message);
            },
          },
          queries: {
            retry: (failureCount, error: any) => {
              if ([401, 403, 404].includes(error.statusCode)) {
                return false;
              }

              if (failureCount >= 3) {
                return false;
              }

              return true;
            },
          },
        },
      }),
  );

  const persister = createSyncStoragePersister({
    storage: typeof window !== 'undefined' ? window.localStorage : null,
    serialize: (data: any) => {
      const newQueries: any[] = [];
      const queries = data.clientState.queries || [];

      for (const query of queries) {
        if (!query.state.data?.pageParams?.length) {
          newQueries.push(query);
          continue;
        }

        newQueries.push({
          ...query,
          state: {
            ...query?.state,
            data: {
              ...query?.state?.data,
              pageParams: [query?.state?.data?.pageParams?.[0]].filter(
                (p) => p,
              ),
              pages: [query?.state?.data?.pages?.[0]].filter((p) => p),
            },
          },
        });
      }

      return JSON.stringify({
        ...data,
        clientState: {
          ...data.clientState,
          queries: newQueries,
        },
      });
    },
  });

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
