'use client';

import { useState } from 'react';
import { PER_PAGE } from './constants';
import { Pagination } from '@nextui-org/react';
import Table from '../Table';
import type { Message } from './types';
import { Pagination as PaginationType } from '../types';
import useSWR from 'swr';
import fetcher from '@/app/utils/fetcher';

type MessagesPagination = PaginationType & {
  messages: Message[];
};

export default function SendingHistoryContent() {
  const [page, setPage] = useState(1);
  const { data: messagesPagination, isLoading } = useSWR<MessagesPagination>(
    `/user/messages?page=${page}&take=${PER_PAGE}`,
    fetcher,
  );

  return (
    <>
      <h1 className="text-2xl">
        <span className="font-bold">Your</span> sending history
      </h1>

      <div>
        <Table
          isLoading={isLoading}
          columns={['ID', 'From', 'To', 'Subject', 'Sent at']}
          rows={
            messagesPagination?.messages.map((message) => [
              message.id,
              message.sender.email,
              message.to,
              message.subject,
              new Date(message.sentAt).toLocaleString(),
            ]) || []
          }
        />
      </div>

      {(messagesPagination?.totalPages || 0) > 1 && (
        <div className="flex gap-2 items-center">
          <Pagination
            size="sm"
            page={page}
            total={messagesPagination?.totalPages || 0}
            onChange={(nextPage) => setPage(nextPage)}
          />
        </div>
      )}
    </>
  );
}
