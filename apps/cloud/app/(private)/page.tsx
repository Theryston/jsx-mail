'use client';

import { Container } from '@/components/container';
import { InsightsChart } from '@/components/insights-chart';
import { SmallCard } from '@jsx-mail/ui/small-card';
import { useInsights, useMe } from '@/hooks/user';
import { titleCase } from '@/utils/title-case';

export default function Home() {
  const { data: insight } = useInsights();
  const { data: me } = useMe();

  return (
    <Container header>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl">
          <span className="font-bold">Welcome,</span>{' '}
          {titleCase(me?.name ?? '')}
        </h1>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {insight?.DATA.map((insight) => (
            <SmallCard
              key={insight.title}
              title={insight.title}
              value={insight.value}
            />
          ))}
        </div>

        {insight && <InsightsChart insight={insight} />}
      </div>
    </Container>
  );
}
