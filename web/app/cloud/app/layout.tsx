import Header from './Header';
import { CloudAppContextProvider } from './context';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <CloudAppContextProvider>
      <Header />
      <div className="px-6 py-4">{children}</div>
    </CloudAppContextProvider>
  );
}
