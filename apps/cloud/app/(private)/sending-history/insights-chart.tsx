/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import * as React from 'react';
import { Card, CardContent } from '@jsx-mail/ui/card';
import { Skeleton } from '@jsx-mail/ui/skeleton';
import { MessageInsightsResponse } from '@/types/message';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import moment from 'moment';

interface InsightsChartProps {
  data: MessageInsightsResponse | undefined;
  isLoading: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-800 p-3 rounded-lg border border-zinc-700 shadow-md">
        <p className="text-xs text-zinc-400 mb-1">
          {moment(label).format('MMM D')}
        </p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <p className="text-xs">
              <span className="font-medium">{entry.name}:</span>{' '}
              <span className="text-zinc-300">{entry.value}</span>
            </p>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export function InsightsChart({ data, isLoading }: InsightsChartProps) {
  const chartData = React.useMemo(() => {
    if (!data || !data.DAYS.length || !data.MESSAGES.length) return [];

    return data.DAYS.map((day, index) => {
      const dataPoint: Record<string, any> = { date: day };

      data.MESSAGES.forEach((message) => {
        dataPoint[message.status] = message.days[index];
      });

      return dataPoint;
    });
  }, [data]);

  if (isLoading) {
    return (
      <Card className="bg-zinc-900 border-none">
        <CardContent className="px-2">
          <h2 className="text-sm text-muted-foreground font-normal mb-5 px-3">
            Message Insights
          </h2>
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.DAYS.length || !data.MESSAGES.length) {
    return (
      <Card className="bg-zinc-900 border-none">
        <CardContent className="px-2">
          <h2 className="text-sm text-muted-foreground font-normal mb-5 px-3">
            Message Insights
          </h2>
          <div className="flex items-center justify-center h-[250px] w-full text-muted-foreground text-xs">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-zinc-900 border-none">
      <CardContent className="px-2">
        <h2 className="text-sm text-muted-foreground font-normal mb-5 pl-5">
          Message Insights
        </h2>

        <div className="aspect-auto h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                tickFormatter={(value) => moment(value).format('MMM D')}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />

              {data.MESSAGES.map((message) => (
                <Line
                  key={message.status}
                  name={message.status}
                  type="monotone"
                  dataKey={message.status}
                  stroke={message.color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
