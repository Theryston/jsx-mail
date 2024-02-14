import Domains from './content';
import axios from '@/app/utils/axios';

export default async function DomainPage() {
  const { data } = await axios.get('/domain');

  return <Domains domains={data} />;
}
