'use client';

import * as React from 'react';
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from 'next/navigation';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ThemeProviderProps } from 'next-themes/dist/types';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        <CacheProvider>{children}</CacheProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}

const CacheProvider = ({ children }: { children: React.ReactNode }) => {
  const [isClient, setIsClient] = React.useState(false);
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            gcTime: 1000 * 60 * 60 * 24,
            retry(failureCount, error: any) {
              if (error.response?.status === 403) return false;
              return failureCount < 3;
            },
          },
        },
      }),
  );

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  const persister = createSyncStoragePersister({
    storage: window.localStorage,
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
};
