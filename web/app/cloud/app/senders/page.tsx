import { cookies } from 'next/headers';
import Content from './content';
import axios from '@/utils/axios';
import { redirect } from 'next/navigation';

export default async function SendersPage() {
  const token = cookies().get('token');

  if (!token) {
    redirect('/cloud/sign-in');
  }

  const { data } = await axios.get('/sender', {
    headers: {
      'Session-Token': token.value,
    },
  });

  return <Content senders={data} />;
}
