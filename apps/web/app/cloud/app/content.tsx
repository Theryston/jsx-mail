'use client';

import { formatSize } from '@/app/utils/format';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
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
  MESSAGES_SENT: number;
  STORAGE: number;
  MESSAGES_SENT_BY_DAY: MessagesSentByDay[];
};

type Props = {
  insights: Insight;
};

export default function HomePageContent({ insights }: Props) {
  const { user } = useCloudAppContext();
  const [messagesByDay, setMessagesByDay] = useState<MessagesSentByDay[]>([]);

  useEffect(() => {
    setMessagesByDay(
      insights.MESSAGES_SENT_BY_DAY.sort(
        (a, b) => new Date(a.sentDay).getTime() - new Date(b.sentDay).getTime(),
      ),
    );
  }, [insights.MESSAGES_SENT_BY_DAY]);

  return (
    <main>
      <h1 className="text-3xl font-bold">
        Hello {titleCase(user.name).split(' ')[0]},
      </h1>
      <p className="text-gray-500">Welcome to your dashboard</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        <Card className="min-h-[200px]">
          <CardBody className="flex flex-col justify-center items-center h-full w-full p-0">
            <h2 className="text-2xl font-bold">{insights.MESSAGES_SENT}</h2>
            <p className="text-gray-500">Messages sent this month</p>
          </CardBody>
        </Card>
        <Card className="min-h-[200px]">
          <CardBody className="flex flex-col justify-center items-center h-full w-full p-0">
            <h2 className="text-2xl font-bold">
              {formatSize(insights.STORAGE)}
            </h2>
            <p className="text-gray-500">Storage used</p>
          </CardBody>
        </Card>
      </div>
      <div className="mt-4">
        <Card>
          <CardHeader className="flex flex-col items-start">
            <h2 className="text-xl font-bold">Messages sent by day</h2>
            <p className="text-gray-500">How many messages were sent by day</p>
          </CardHeader>
          <CardBody className="w-full h-[300px]">
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
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
