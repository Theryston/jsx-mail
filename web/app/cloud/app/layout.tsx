import { CloudAppContextProvider } from './context';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <CloudAppContextProvider>{children}</CloudAppContextProvider>;
}
