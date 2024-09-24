import axios from '@/app/utils/axios';
import AccountContent from './content';

export default async function Sessions() {
  const { data: sessions } = await axios.get('/session');

  return <AccountContent sessions={sessions} />;
}
