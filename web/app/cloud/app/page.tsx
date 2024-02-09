import axios from '@/utils/axios';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import HomePageContent from './content';

export default async function Page() {
  const token = cookies().get('token')?.value;

  if (!token) {
    redirect('/cloud/sign-in');
  }

  const { data: insights } = await axios.get('/user/insights', {
    headers: {
      'Session-Token': token,
    },
  });

  return <HomePageContent insights={insights} />;
}
