'use client';

import { useCallback, useState } from 'react';
import type { Message } from './types';
import axios from '@/app/utils/axios';
import { PER_PAGE } from './constants';
import { Pagination, Skeleton } from '@nextui-org/react';
import Table from '../Table';

type Props = {
  messages: Message[];
  totalPages: number;
};

export function SendingHistoryContent({
  messages: initialMessages,
  totalPages: initialTotalPages,
}: Props) {
  const [messages, setMessages] = useState(initialMessages);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  const fetchMessages = useCallback(async (nextPage: number) => {
    setIsLoading(true);

    try {
      const response = await axios.get('/user/messages', {
        params: {
          page: nextPage,
          take: PER_PAGE,
        },
      });

      setMessages(response.data.messages);
      setTotalPages(response.data.totalPages);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <>
      <h1 className="text-2xl">
        <span className="font-bold">Your</span> sending history
      </h1>

      <div>
        {!isLoading ? (
          <Table
            columns={['ID', 'From', 'To', 'Subject', 'Sent at']}
            rows={messages.map((message) => [
              message.id,
              message.sender.email,
              message.to,
              message.subject,
              new Date(message.sentAt).toLocaleString(),
            ])}
          />
        ) : (
          <div className="w-full flex items-center justify-center">
            <Table
              columns={['ID', 'From', 'To', 'Subject', 'Sent at']}
              rows={Array.from({ length: 6 }).map((_, index) => [
                <Skeleton className="rounded-xl h-10 w-full" key={index} />,
                <Skeleton className="rounded-xl h-10 w-full" key={index} />,
                <Skeleton className="rounded-xl h-10 w-full" key={index} />,
                <Skeleton className="rounded-xl h-10 w-full" key={index} />,
                <Skeleton className="rounded-xl h-10 w-full" key={index} />,
              ])}
            />
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex gap-2 items-center">
          <Pagination
            size="sm"
            page={page}
            total={totalPages}
            onChange={(nextPage) => {
              setPage(nextPage);
              fetchMessages(nextPage);
            }}
          />
        </div>
      )}
    </>
  );
}
