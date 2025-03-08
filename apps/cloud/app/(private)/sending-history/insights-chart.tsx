'use client';

import { MessageInsightsResponse } from '@/types/message';
import { Card, CardContent, CardHeader, CardTitle } from '@jsx-mail/ui/card';
import { Skeleton } from '@jsx-mail/ui/skeleton';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface InsightsChartProps {
  data: MessageInsightsResponse | undefined;
  isLoading: boolean;
}

export function InsightsChart({ data, isLoading }: InsightsChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Message Insights</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <Skeleton className="h-full w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.DAYS.length || !data.MESSAGES.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Message Insights</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  // Transform data for recharts
  const chartData = data.DAYS.map((day, index) => {
    const dataPoint: any = { day };
    data.MESSAGES.forEach((message) => {
      dataPoint[message.status] = message.days[index];
    });
    return dataPoint;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Message Insights</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            {data.MESSAGES.map((message) => (
              <Line
                key={message.status}
                type="monotone"
                dataKey={message.status}
                stroke={message.color}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
