import BillingContent from './content';
import axios from '@/app/utils/axios';

export default async function Page() {
  const { data: balance } = await axios.get('/user/balance');

  const {
    data: { transactions, totalPages },
  } = await axios.get('/user/transactions', {
    params: {
      page: 1,
      take: 10,
    },
  });

  return (
    <BillingContent
      balance={balance}
      totalPages={totalPages}
      transactions={transactions}
    />
  );
}
