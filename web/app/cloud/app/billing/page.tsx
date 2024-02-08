import { cookies } from 'next/headers';
import BillingContent from './content';
import { redirect } from 'next/navigation';
import axios from '@/utils/axios';

export default async function Page() {
  const token = cookies().get('token')?.value;

  if (!token) {
    redirect('/cloud/sign-in');
  }

  const { data: balance } = await axios.get('/user/balance', {
    headers: {
      'Session-Token': token,
    },
  });

  const {
    data: { transactions, totalPages },
  } = await axios.get('/user/transactions', {
    headers: {
      'Session-Token': token,
    },
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
