import axios from '@/utils/axios';
import { cookies } from 'next/headers';
import ContentSessions from './content';

export default async function Sessions() {
  const { data: sessions } = await axios.get('/session', {
    headers: {
      'Session-Token': cookies().get('token')?.value,
    },
  });

  return <ContentSessions sessions={sessions} />;
}
