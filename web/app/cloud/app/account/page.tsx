import Pricing from '../../pricing/page';
import BasicInformation from './BasicInformation';
import Sessions from './Sessions';

export default async function Page() {
  return (
    <main>
      <BasicInformation />
      <div className="mt-6 flex flex-col gap-6">
        <Sessions />
        <Pricing />
      </div>
    </main>
  );
}
