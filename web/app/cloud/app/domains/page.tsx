import { cookies } from 'next/headers';
import Domains from './content';
import { redirect } from 'next/navigation';
import axios from '@/utils/axios';

export default async function Page() {
  const token = cookies().get('token');

  if (!token) {
    redirect('/cloud/sign-in');
  }

  const { data } = await axios.get('/domain', {
    headers: {
      'Session-Token': token.value,
    },
  });

  return <Domains domains={data} />;
}
