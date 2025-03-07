'use client';

import * as React from 'react';
import {
  ThemeProvider as NextThemesProvider,
  UseThemeProps,
} from 'next-themes';
import { useTheme as useNextTheme } from 'next-themes';

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

export function useTheme(): {
  theme: 'dark' | 'light' | 'system' | undefined;
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
} {
  const { theme, setTheme } = useNextTheme();

  return {
    theme: theme as 'dark' | 'light' | 'system',
    setTheme: (theme: 'dark' | 'light' | 'system') => setTheme(theme),
  };
}
