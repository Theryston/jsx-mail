import Header from './Header';
import { CloudAppContextProvider } from './context';
import { redirect } from 'next/navigation';
import axios from '@/app/utils/axios';
import Sidebar from './Sidebar';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const { data: user } = await axios.get('/user/me');

    if (user.errorMessage || user.isError || user.message) {
      redirect('/sign-in');
    }

    return (
      <CloudAppContextProvider user={user}>
        <Header />
        <div className="px-12 py-12 w-full flex gap-12">
          <div className="relative">
            <Sidebar />
          </div>
          <div className="w-[calc(100%-23rem)] flex flex-col gap-6">
            {children}
          </div>
        </div>
      </CloudAppContextProvider>
    );
  } catch (error: any) {
    console.log('error', error);
    redirect('/sign-in');
  }
}
