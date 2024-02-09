import Header from './Header';
import { CloudAppContextProvider } from './context';
import { redirect } from 'next/navigation';
import axios from '@/app/utils/axios';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const { data: user } = await axios.get('/user/me');

    if (user.errorMessage || user.isError || user.message) {
      redirect('/cloud/sign-in');
    }

    return (
      <CloudAppContextProvider user={user}>
        <Header />
        <div className="px-6 py-4">{children}</div>
      </CloudAppContextProvider>
    );
  } catch (error: any) {
    console.log('error', error);
    redirect('/cloud/sign-in');
  }
}
