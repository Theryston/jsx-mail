import Pricing from '../../pricing/page';
import BasicInformation from './BasicInformation';

export default async function Page() {
  return (
    <main>
      <BasicInformation />
      <div className="mt-6">
        <Pricing />
      </div>
    </main>
  );
}
