import Header from './Header';
import { CloudAppContextProvider } from './context';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <CloudAppContextProvider>
      <Header />
      {children}
    </CloudAppContextProvider>
  );
}
