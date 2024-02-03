'use client';

import CustomTable from '../CustomTable';

export default function Page() {
  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-5 ml-2">
        Domains
      </h1>
      <CustomTable
        items={[
          {
            id: '1',
            name: 'example.com',
            status: {
              value: 'active',
              label: 'Verified',
            },
            actions: ['Edit', 'Delete'],
          },
        ]}
        onActionClick={(action, item) => {
          alert(`${action} ${item.name}`);
        }}
        onNewClick={() => {
          alert('new');
        }}
      />
    </>
  );
}
