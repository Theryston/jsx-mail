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

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    Crisp.configure(process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID || '');
  }, []);

  return (
    <Suspense>
      <ThemeProvider>
        <ProgressBar
          height="2px"
          color="#fff"
          options={{ showSpinner: false }}
        />

        <QueryClientProvider>{children}</QueryClientProvider>
        <Toaster />
      </ThemeProvider>
    </Suspense>
  );
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
              if (failureCount >= 3) {
                return false;
              }

              if ([401, 403, 404].includes(error.status)) {
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
