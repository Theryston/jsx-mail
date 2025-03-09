import '@/styles/globals.css';
import { Metadata, Viewport } from 'next';
import { GoogleTagManager } from '@next/third-parties/google';
import { Poppins as Font } from 'next/font/google';
import clsx from 'clsx';

import { Providers } from './providers';

export const metadata: Metadata = {
  title: {
    default: 'JSX Mail - The complete solution for your email flow',
    template: `%s - JSX Mail`,
  },
  description:
    'The complete solution for your email flow, combining a modern framework for template creation with the most efficient and cost-effective cloud for email delivery.',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: 'black' }],
};

const font = Font({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || ''} />
      <body className={clsx('min-h-screen bg-background', font.className)}>
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
