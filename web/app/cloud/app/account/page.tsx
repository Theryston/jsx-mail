import axios from '@/utils/axios';
import SectionItem from '../SectionItem';
import SectionsList from '../SectionsList';
import BasicInformation from './BasicInformation';
import Pricing from './Pricing';

export default async function Page() {
  const { data: pricing } = await axios.get('/user/price', {
    headers: {
      'Session-Token': 'no-auth',
    },
  });

  return (
    <main>
      <h1 className="text-3xl font-bold">Account</h1>
      <p className="text-gray-500 mt-2">Check out your account information</p>
      <div className="mt-6">
        <SectionsList>
          <SectionItem
            title="Basic information"
            description="Here is your basic information. You cannot change its values"
          >
            <BasicInformation />
          </SectionItem>
          <SectionItem
            title="Pricing"
            description="Our pricing system is very straightforward: You add a balance, and we automatically deduct from that balance each month. Below is the list of our pricing:"
          >
            <Pricing pricing={pricing} />
          </SectionItem>
        </SectionsList>
      </div>
    </main>
  );
}
