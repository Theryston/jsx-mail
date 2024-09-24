import axios from '@/app/utils/axios';
import { SendingHistoryContent } from './content';
import { PER_PAGE } from './constants';

export default async function SendingHistoryPage() {
  const {
    data: { messages, totalPages },
  } = await axios.get('/user/messages', {
    params: {
      page: 1,
      take: PER_PAGE,
    },
  });

  return <SendingHistoryContent messages={messages} totalPages={totalPages} />;
}
