import { cookies } from 'next/headers';
import Header from './Header';
import { CloudAppContextProvider } from './context';
import { redirect } from 'next/navigation';
import axios from '@/utils/axios';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const token = cookies().get('token');

    if (!token) {
      console.log('no token');
      redirect('/cloud/sign-in');
    }

    const { data: user } = await axios.get('/user/me', {
      headers: {
        'Force-Auth': 'true',
        'Session-Token': token.value,
      },
    });

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
