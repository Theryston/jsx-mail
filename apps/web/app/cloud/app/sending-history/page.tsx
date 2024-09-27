'use client';

import { useCallback, useEffect, useState } from 'react';
import axios from '@/app/utils/axios';
import { PER_PAGE } from './constants';
import { Pagination } from '@nextui-org/react';
import Table from '../Table';
import type { Message } from './types';

export default function SendingHistoryContent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  const fetchMessages = useCallback(async (nextPage: number) => {
    try {
      setIsLoading(true);

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

  useEffect(() => {
    fetchMessages(1);
  }, [fetchMessages]);

  return (
    <>
      <h1 className="text-2xl">
        <span className="font-bold">Your</span> sending history
      </h1>

      <div>
        <Table
          isLoading={isLoading}
          columns={['ID', 'From', 'To', 'Subject', 'Sent at']}
          rows={messages.map((message) => [
            message.id,
            message.sender.email,
            message.to,
            message.subject,
            new Date(message.sentAt).toLocaleString(),
          ])}
        />
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
