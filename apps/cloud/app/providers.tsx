import { Toaster } from '@jsx-mail/ui/sonner';
import { ThemeProvider } from '@jsx-mail/ui/theme';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
      <Toaster />
    </ThemeProvider>
  );
}
