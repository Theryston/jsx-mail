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
import { useCallback, useEffect, useState } from 'react';
import Card from './Card';
import { Spinner } from '@nextui-org/react';
import axios from '@/app/utils/axios';
import { toast } from 'react-toastify';

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
  STORAGE: number;
  SESSIONS: number;
  MESSAGES_SENT_BY_DAY: MessagesSentByDay[];
};

export default function HomePageContent() {
  const [insights, setInsights] = useState<Insight | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useCloudAppContext();
  const [messagesByDay, setMessagesByDay] = useState<MessagesSentByDay[]>([]);

  const fetchInsights = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get('/user/insights');
      setInsights(data);
    } catch (error) {
      toast.error('Failed to fetch insights');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setMessagesByDay(
      insights?.MESSAGES_SENT_BY_DAY.sort(
        (a, b) => new Date(a.sentDay).getTime() - new Date(b.sentDay).getTime(),
      ) || [],
    );
  }, [insights]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  return (
    <>
      {isLoading ? (
        <div className="h-full flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <>
          <h1 className="text-2xl">
            <span className="font-bold">Welcome,</span> {titleCase(user.name)}
          </h1>
          <div className="grid grid-cols-4 gap-6">
            <Card height="8rem">
              <div className="w-full h-full flex flex-col justify-between">
                <p className="text-xs font-medium">Your balance</p>
                <p className="text-3xl font-bold text-primary">
                  {insights?.BALANCE}
                </p>
              </div>
            </Card>
            <Card height="8rem">
              <div className="w-full h-full flex flex-col justify-between">
                <p className="text-xs font-medium">Email sent this month</p>
                <p className="text-3xl font-bold text-primary">
                  {formatNumber(insights?.MESSAGES_SENT || 0)}
                </p>
              </div>
            </Card>
            <Card height="8rem">
              <div className="w-full h-full flex flex-col justify-between">
                <p className="text-xs font-medium">Current Storage</p>
                <p className="text-3xl font-bold text-primary">
                  {formatSize(insights?.STORAGE || 0)}
                </p>
              </div>
            </Card>
            <Card height="8rem">
              <div className="w-full h-full flex flex-col justify-between">
                <p className="text-xs font-medium">Sessions</p>
                <p className="text-3xl font-bold text-primary">
                  {formatNumber(insights?.SESSIONS || 0)}
                </p>
              </div>
            </Card>
          </div>
          <Card>
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
      )}
    </>
  );
}
