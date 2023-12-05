import { Space_Grotesk } from 'next/font/google';

const font = Space_Grotesk({ subsets: ['latin'] });

export default function MyApp({ Component, pageProps }: any) {
  return (
    <main className={font.className}>
      <Component {...pageProps} />
    </main>
  );
}
