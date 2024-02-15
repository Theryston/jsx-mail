'use client';

import {
  Button,
  Card,
  CardBody,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from '@nextui-org/react';
import { Balance } from '../types';
import { useCallback, useState } from 'react';
import moment from 'moment';
import axios from '@/app/utils/axios';
import { toast } from 'react-toastify';
import AddBalanceModal from './AddBalanceModal';
import SectionsList from '../SectionsList';
import SectionItem from '../SectionItem';

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

type Props = {
  balance: FullBalance;
  totalPages: number;
  transactions: Transaction[];
};

export default function BillingContent({
  balance,
  totalPages,
  transactions: initialTransactions,
}: Props) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const {
    isOpen: isAddBalanceModalOpen,
    onOpen: onAddBalanceModalOpen,
    onOpenChange: onAddBalanceModalOpenChange,
  } = useDisclosure();

  const fetchTransactions = useCallback(async (nextPage: number) => {
    setIsLoading(true);
    try {
      const {
        data: { transactions },
      } = await axios.get('/user/transactions', {
        params: {
          page: nextPage,
          take: 10,
        },
      });

      setTransactions(transactions);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <main className="flex flex-col gap-6 mt-4">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Billing</h1>
          <p className="text-gray-500">Manage your account balance</p>
        </div>
        <Button
          color="primary"
          onClick={onAddBalanceModalOpen}
          className="w-full sm:w-auto"
        >
          Add balance
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="min-h-[200px]">
          <CardBody className="flex flex-col justify-center items-center h-full w-full p-0">
            <h2 className="text-2xl font-bold">
              {balance.CURRENT.friendlyAmount}
            </h2>
            <p className="text-gray-500">Current balance</p>
          </CardBody>
        </Card>
        <Card className="min-h-[200px]">
          <CardBody className="flex flex-col justify-center items-center h-full w-full p-0">
            <h2 className="text-2xl font-bold">
              {balance.MONTH_ADDED.friendlyAmount}
            </h2>
            <p className="text-gray-500">Balance added this month</p>
          </CardBody>
        </Card>
        <Card className="min-h-[200px]">
          <CardBody className="flex flex-col justify-center items-center h-full w-full p-0">
            <h2 className="text-2xl font-bold">
              {balance.MONTH_CHARGED.friendlyFullAmount}
            </h2>
            <p className="text-gray-500">Balance charged this month</p>
          </CardBody>
        </Card>
      </div>
      <SectionsList>
        <SectionItem
          title="Transactions"
          description="List of transactions in your account"
        >
          <Table
            aria-label="List of transactions"
            className="overflow-x-auto shadow-2xl"
            removeWrapper
          >
            <TableHeader>
              <TableColumn>ID</TableColumn>
              <TableColumn>Description</TableColumn>
              <TableColumn>Amount</TableColumn>
              <TableColumn>Date</TableColumn>
            </TableHeader>
            <TableBody
              isLoading={isLoading}
              loadingContent={<Spinner />}
              emptyContent="No transaction found"
            >
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.id}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell
                    className={
                      transaction.amount < 0 ? 'text-red-500' : 'text-green-500'
                    }
                  >
                    {transaction.friendlyAmount}
                  </TableCell>
                  <TableCell>
                    {moment(transaction.createdAt).format(
                      'DD/MM/YYYY HH:mm:ss',
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex w-full justify-center mt-4">
            <Pagination
              isCompact
              showControls
              showShadow
              page={page}
              total={totalPages}
              onChange={(nextPage) => {
                setPage(nextPage);
                fetchTransactions(nextPage);
              }}
            />
          </div>
        </SectionItem>
      </SectionsList>
      <AddBalanceModal
        isOpen={isAddBalanceModalOpen}
        onOpenChange={onAddBalanceModalOpenChange}
      />
    </main>
  );
}
