'use client';

import {
  Pagination,
  Skeleton,
  Spinner,
  useDisclosure,
} from '@nextui-org/react';
import { Balance } from '../types';
import { useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import axios from '@/app/utils/axios';
import { toast } from 'react-toastify';
import AddBalanceModal from './AddBalanceModal';
import SectionsList from '../SectionsList';
import SectionItem from '../SectionItem';
import Card from '../Card';
import { AddCircle } from 'iconsax-react';
import Table from '../Table';

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

export default function BillingContent() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<FullBalance | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const {
    isOpen: isAddBalanceModalOpen,
    onOpen: onAddBalanceModalOpen,
    onOpenChange: onAddBalanceModalOpenChange,
  } = useDisclosure();

  const fetchTransactions = useCallback(async (nextPage: number) => {
    setIsTransactionsLoading(true);
    try {
      const {
        data: { transactions, totalPages: dbTotalPages },
      } = await axios.get('/user/transactions', {
        params: {
          page: nextPage,
          take: 10,
        },
      });

      setTransactions(transactions);
      setTotalPages(dbTotalPages);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsTransactionsLoading(false);
    }
  }, []);

  const fetchBalance = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: dbBalance } = await axios.get('/user/balance');
      setBalance(dbBalance);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions(1);
    fetchBalance();
  }, [fetchTransactions, fetchBalance]);

  return (
    <>
      {isLoading && (
        <div className="w-full h-full flex items-center justify-center">
          <Spinner />
        </div>
      )}
      {!isLoading && (
        <>
          <h1 className="text-2xl">
            <span className="font-bold">Your</span> billing & transactions
          </h1>
          <div className="grid grid-cols-4 gap-6">
            <Card height="8rem">
              <div className="w-full h-full flex flex-col justify-between">
                <p className="text-xs font-medium">Your balance</p>
                <p className="text-3xl font-bold text-primary">
                  {balance?.CURRENT.friendlyAmount}
                </p>
              </div>
            </Card>
            <Card height="8rem">
              <div className="w-full h-full flex flex-col justify-between">
                <p className="text-xs font-medium">Balance added</p>
                <p className="text-3xl font-bold text-primary">
                  {balance?.MONTH_ADDED.friendlyAmount}
                </p>
              </div>
            </Card>
            <Card height="8rem">
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
            rows={transactions.map((transaction) => [
              transaction.id,
              transaction.description,
              transaction.friendlyAmount,
              moment(transaction.createdAt).format('DD/MM/YYYY'),
            ])}
          />

          {totalPages > 1 && (
            <div className="flex gap-2 items-center">
              <Pagination
                size="sm"
                page={page}
                total={totalPages}
                onChange={(nextPage) => {
                  setPage(nextPage);
                  fetchTransactions(nextPage);
                }}
              />
            </div>
          )}

          <AddBalanceModal
            isOpen={isAddBalanceModalOpen}
            onOpenChange={onAddBalanceModalOpenChange}
          />
        </>
      )}
    </>
  );
}
