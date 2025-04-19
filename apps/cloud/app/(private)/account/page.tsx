'use client';

import { Container } from '@/components/container';
import { UserForm } from './user-form';
import { Sessions } from './sessions';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@jsx-mail/ui/tabs';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SMTP } from './smtp';
import { useRouter } from 'next/navigation';
import { Webhook } from './webhook';

export default function AccountPage() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'account';
  const [tab, setTab] = useState(defaultTab);
  const router = useRouter();

  const TABS = [
    {
      label: 'Account',
      value: 'account',
      component: <UserForm />,
    },
    {
      label: 'API Keys',
      value: 'api-keys',
      component: <Sessions />,
    },
    {
      label: 'SMTP',
      value: 'smtp',
      component: <SMTP />,
    },
    {
      label: 'Webhook',
      value: 'webhook',
      component: <Webhook />,
    },
  ];

  useEffect(() => {
    const newTab = searchParams.get('tab');

    if (newTab && TABS.some((t) => t.value === newTab)) {
      setTab(newTab);
    }
  }, [searchParams]);

  return (
    <Container header>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl">
          <span className="font-bold">Your</span> settings
        </h1>
        <Tabs
          value={tab}
          onValueChange={(value) => {
            setTab(value);
            router.push(`/account?tab=${value}`);
          }}
          className="flex flex-col gap-4"
        >
          <TabsList className="bg-zinc-700/20 flex gap-2">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-zinc-700/50 data-[state=active]:text-white hover:bg-zinc-700/50 cursor-pointer px-3 text-sx rounded-md"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {TABS.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {tab.component}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Container>
  );
}
