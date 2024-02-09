import Content from './content';
import axios from '@/app/utils/axios';

export default async function SendersPage() {
  const { data } = await axios.get('/sender');

  return <Content senders={data} />;
}
