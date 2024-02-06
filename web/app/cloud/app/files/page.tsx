import axios from '@/utils/axios';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Content } from './content';
import { PER_PAGE } from './constants';

export default async function PageFiles() {
  const token = cookies().get('token');

  if (!token) {
    redirect('/cloud/sign-in');
  }

  const {
    data: { files, totalPages },
  } = await axios.get('/file', {
    params: {
      page: 1,
      take: PER_PAGE,
    },
    headers: {
      'Session-Token': token.value,
    },
  });

  return <Content files={files} totalPages={totalPages} />;
}
