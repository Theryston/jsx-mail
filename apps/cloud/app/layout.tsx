import type { Metadata } from 'next';
import './globals.css';
import '@jsx-mail/ui/globals.css';
import { Poppins } from 'next/font/google';
import { cn } from '@jsx-mail/ui/lib/utils';
import { Providers } from './providers';

const font = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'JSX Mail Cloud',
  description:
    'Send email, host images, get analytics from your email campaigns, and more with JSX Mail Cloud.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(font.className, 'antialiased')}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
