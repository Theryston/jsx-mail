import axios from '@/app/utils/axios';
import ContentSessions from './content';

export default async function Sessions() {
  const { data: sessions } = await axios.get('/session');

  return <ContentSessions sessions={sessions} />;
}
