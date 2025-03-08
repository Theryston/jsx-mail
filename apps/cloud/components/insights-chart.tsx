'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent } from '@jsx-mail/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@jsx-mail/ui/chart';
import { Insight } from '@/types/user';

const chartConfig = {
  messages: {
    label: 'Messages Sent',
  },
} satisfies ChartConfig;

export function InsightsChart({ insight }: { insight: Insight }) {
  const chartData = React.useMemo(() => {
    if (!insight?.MESSAGES_SENT_BY_DAY) return [];

    return insight.MESSAGES_SENT_BY_DAY.map((item) => ({
      date: item.sentDay,
      messages: item.count,
    }));
  }, [insight]);

  return (
    <Card className="bg-zinc-900 border-none">
      <CardContent className="px-2">
        <h2 className="text-sm text-muted-foreground font-normal mb-5 px-3">
          Messages Sent
        </h2>

        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="messages"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });
                  }}
                />
              }
            />

            <Bar dataKey="messages" fill={`var(--chart-1)`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
