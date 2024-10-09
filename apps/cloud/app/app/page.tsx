'use client';

import { formatNumber, formatSize } from '@/app/utils/format';
import { useCloudAppContext } from './context';
import { titleCase } from '@/app/utils/title-case';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  PointElement,
  LineElement,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import Card from './Card';
import useSWR from 'swr';
import fetcher from '@/app/utils/fetcher';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
);

type MessagesSentByDay = {
  sentDay: string;
  count: number;
};

type Insight = {
  BALANCE: string;
  MESSAGES_SENT: number;
  CLICK_RATE: number;
  OPEN_RATE: number;
  MESSAGES_SENT_BY_DAY: MessagesSentByDay[];
};

export default function HomePageContent() {
  const { user } = useCloudAppContext();
  const { data: insights, isLoading } = useSWR<Insight>(
    '/user/insights',
    fetcher,
  );
  const [messagesByDay, setMessagesByDay] = useState<MessagesSentByDay[]>([]);

  useEffect(() => {
    setMessagesByDay(
      insights?.MESSAGES_SENT_BY_DAY.sort(
        (a, b) => new Date(a.sentDay).getTime() - new Date(b.sentDay).getTime(),
      ) || [],
    );
  }, [insights]);

  return (
    <>
      <h1 className="text-2xl">
        <span className="font-bold">Welcome,</span> {titleCase(user.name)}
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <Card height="8rem" isLoading={isLoading}>
          <div className="w-full h-full flex flex-col justify-between">
            <p className="text-xs font-medium">Your balance</p>
            <p className="text-3xl font-bold text-primary">
              {insights?.BALANCE}
            </p>
          </div>
        </Card>
        <Card height="8rem" isLoading={isLoading}>
          <div className="w-full h-full flex flex-col justify-between">
            <p className="text-xs font-medium">Email sent this month</p>
            <p className="text-3xl font-bold text-primary">
              {formatNumber(insights?.MESSAGES_SENT || 0)}
            </p>
          </div>
        </Card>
        <Card height="8rem" isLoading={isLoading}>
          <div className="w-full h-full flex flex-col justify-between">
            <p className="text-xs font-medium">Open rate</p>
            <p className="text-3xl font-bold text-primary">
              {((insights?.OPEN_RATE || 0) * 100).toFixed(2)}%
            </p>
          </div>
        </Card>
        <Card height="8rem" isLoading={isLoading}>
          <div className="w-full h-full flex flex-col justify-between">
            <p className="text-xs font-medium">Click rate</p>
            <p className="text-3xl font-bold text-primary">
              {((insights?.CLICK_RATE || 0) * 100).toFixed(2)}%
            </p>
          </div>
        </Card>
      </div>
      <Card className="w-full md:h-[39vh] 2xl:h-[48vh]" isLoading={isLoading}>
        <div className="w-full h-full flex flex-col justify-between">
          <p className="text-xs font-medium">Messages sent by day</p>
          <div className="w-full md:h-[31vh] 2xl:h-[42vh]">
            <Line
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    ticks: {
                      stepSize: 1,
                    },
                  },
                },
              }}
              data={{
                labels: messagesByDay.map((day) => day.sentDay),
                datasets: [
                  {
                    data: messagesByDay.map((day) => day.count),
                    backgroundColor: 'rgb(59 130 246)',
                    showLine: true,
                  },
                ],
              }}
            />
          </div>
        </div>
      </Card>
    </>
  );
}