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

        <div className="p-6 md:p-12 w-full flex gap-12">
          <div className="hidden md:block relative">
            <Sidebar />
          </div>
          <div className="w-full md:w-[calc(100%-23rem)] flex flex-col gap-4 md:gap-6">
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
