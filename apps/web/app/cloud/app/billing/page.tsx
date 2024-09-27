'use client';

import { Pagination, Spinner, useDisclosure } from '@nextui-org/react';
import type { Balance, Pagination as PaginationType } from '../types';
import { useState } from 'react';
import moment from 'moment';
import AddBalanceModal from './AddBalanceModal';
import Card from '../Card';
import { AddCircle } from 'iconsax-react';
import Table from '../Table';
import useSWR from 'swr';
import fetcher from '@/app/utils/fetcher';

type FullBalance = {
  CURRENT: Balance;
  MONTH_ADDED: Balance;
  MONTH_CHARGED: Balance;
};

type Transaction = {
  id: string;
  amount: number;
  friendlyAmount: string;
  description: string;
  createdAt: string;
};

type TransactionsPagination = PaginationType & {
  transactions: Transaction[];
};

export default function BillingContent() {
  const { data: balance, isLoading } = useSWR<FullBalance>(
    '/user/balance',
    fetcher,
  );
  const [page, setPage] = useState(1);
  const { data: transactionsPagination, isLoading: isTransactionsLoading } =
    useSWR<TransactionsPagination>(
      `/user/transactions?page=${page}&take=10`,
      fetcher,
    );
  const {
    isOpen: isAddBalanceModalOpen,
    onOpen: onAddBalanceModalOpen,
    onOpenChange: onAddBalanceModalOpenChange,
  } = useDisclosure();

  return (
    <>
      <h1 className="text-2xl">
        <span className="font-bold">Your</span> billing & transactions
      </h1>
      <div className="grid grid-cols-4 gap-6">
        <Card height="8rem" isLoading={isLoading}>
          <div className="w-full h-full flex flex-col justify-between">
            <p className="text-xs font-medium">Your balance</p>
            <p className="text-3xl font-bold text-primary">
              {balance?.CURRENT.friendlyAmount}
            </p>
          </div>
        </Card>
        <Card height="8rem" isLoading={isLoading}>
          <div className="w-full h-full flex flex-col justify-between">
            <p className="text-xs font-medium">Balance added</p>
            <p className="text-3xl font-bold text-primary">
              {balance?.MONTH_ADDED.friendlyAmount}
            </p>
          </div>
        </Card>
        <Card height="8rem" isLoading={isLoading}>
          <div className="w-full h-full flex flex-col justify-between">
            <p className="text-xs font-medium">Balance charged</p>
            <p className="text-3xl font-bold text-danger">
              {balance?.MONTH_CHARGED.friendlyAmount}
            </p>
          </div>
        </Card>
        <Card height="8rem">
          <div
            className="w-full h-full flex flex-col justify-center items-center text-primary cursor-pointer gap-1"
            onClick={onAddBalanceModalOpen}
          >
            <AddCircle variant="Bold" size="3rem" />
            <span className="text-xs font-medium text-zinc-400 leading-3">
              Add Money
            </span>
          </div>
        </Card>
      </div>

      <Table
        isLoading={isTransactionsLoading}
        columns={['ID', 'Description', 'Amount', 'Created at']}
        rows={
          transactionsPagination?.transactions.map((transaction) => [
            transaction.id,
            transaction.description,
            transaction.friendlyAmount,
            moment(transaction.createdAt).format('DD/MM/YYYY'),
          ]) || []
        }
      />

      {(transactionsPagination?.totalPages || 0) > 1 && (
        <div className="flex gap-2 items-center">
          <Pagination
            size="sm"
            page={page}
            total={transactionsPagination?.totalPages || 0}
            onChange={(nextPage) => {
              setPage(nextPage);
            }}
          />
        </div>
      )}

      <AddBalanceModal
        isOpen={isAddBalanceModalOpen}
        onOpenChange={onAddBalanceModalOpenChange}
      />
    </>
  );
}
