'use client';

import { Container } from '@/components/container';
import { InsightsChart } from '@/components/insights-chart';
import { useInsights, useMe } from '@/hooks/user';
import { InsightData } from '@/types/user';
import { titleCase } from '@/utils/title-case';

export default function Home() {
  const { data: insight } = useInsights();
  const { data: me } = useMe();

  console.log('insights', insight);

  return (
    <Container header>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl">
          <span className="font-bold">Welcome,</span>{' '}
          {titleCase(me?.name ?? '')}
        </h1>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {insight?.DATA.map((insight) => (
            <InsightCard key={insight.title} insightData={insight} />
          ))}
        </div>

        {insight && <InsightsChart insight={insight} />}
      </div>
    </Container>
  );
}

function InsightCard({ insightData }: { insightData: InsightData }) {
  return (
    <div className="flex flex-col gap-8 bg-zinc-900 p-4 rounded-2xl">
      <h2 className="text-xs font-medium">{insightData.title}</h2>
      <p className="text-3xl font-bold text-primary">{insightData.value}</p>
    </div>
  );
}
