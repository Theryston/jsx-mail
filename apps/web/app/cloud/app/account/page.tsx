import Pricing from '../../pricing/page';
import BasicInformation from './BasicInformation';
import Sessions from './Sessions';

export default async function Page() {
  return (
    <main>
      <h1 className="text-3xl font-bold">Account</h1>
      <p className="text-gray-500">Manage your account</p>
      <BasicInformation />
      <div className="mt-6 flex flex-col gap-6">
        <Sessions />
        <Pricing />
      </div>
    </main>
  );
}
