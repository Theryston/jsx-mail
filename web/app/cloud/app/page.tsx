import axios from '@/app/utils/axios';
import HomePageContent from './content';

export default async function Page() {
  const { data: insights } = await axios.get('/user/insights');

  return <HomePageContent insights={insights} />;
}
