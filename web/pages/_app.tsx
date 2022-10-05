import '../styles.css';
import 'nextra-theme-docs/style.css';
import { useEffect, useState } from 'react';

export default function Nextra({ Component, pageProps }) {
  const [layout, setLayout] = useState(null);

  const getLayout = Component.getLayout || (page => page);

  useEffect(() => {
    setLayout(getLayout(<Component {...pageProps} />));
  }, [Component]);

  return layout;
}
