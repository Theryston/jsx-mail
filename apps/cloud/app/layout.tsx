import './globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { Providers } from './providers';
import { GoogleTagManager } from '@next/third-parties/google';

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || ''} />
      <body className={font.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
