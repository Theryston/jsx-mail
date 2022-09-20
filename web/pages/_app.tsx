import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from '../components/globalstyles';
import { theme } from '../theme';
import 'nextra-theme-docs/style.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Head>
          <meta
            name="description"
            content="A framework to create the look of your emails. 🚀✉️"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <GlobalStyle />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
