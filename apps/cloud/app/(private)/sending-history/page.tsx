'use client';

import { Container } from '@/components/container';
import { useState, useEffect } from 'react';
import {
  useMessages,
  useMessageInsights,
  useMessageStatuses,
} from '@/hooks/message';
import { Skeleton } from '@jsx-mail/ui/skeleton';
import { DateFilter } from './date-filter';
import { Filters } from './filters';
import { DataTable } from './data-table';
import { createColumns } from './columns';
import { InsightsChart } from './insights-chart';
import { PaginationControls } from '@jsx-mail/ui/pagination-controls';
import { useSearchParams, useRouter } from 'next/navigation';
import moment from 'moment';
import { DateRange } from 'react-day-picker';

export default function SendingHistoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [page, setPage] = useState(() => {
    const pageParam = searchParams?.get('page');
    return pageParam ? parseInt(pageParam, 10) : 1;
  });

  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const startDateParam = searchParams?.get('startDate');
    const endDateParam = searchParams?.get('endDate');

    if (startDateParam && endDateParam) {
      return {
        from: new Date(startDateParam),
        to: new Date(endDateParam),
      };
    }

    return {
      from: new Date(moment().subtract(30, 'days').format('YYYY-MM-DD')),
      to: new Date(),
    };
  });

  const [fromEmail, setFromEmail] = useState(
    searchParams?.get('fromEmail') || '',
  );
  const [toEmail, setToEmail] = useState(searchParams?.get('toEmail') || '');
  const [statuses, setStatuses] = useState<string[]>(() => {
    const statusesParam = searchParams?.get('statuses');
    return statusesParam ? JSON.parse(statusesParam) : [];
  });

  const startDate = moment(
    dateRange?.from || moment().subtract(30, 'days').toDate(),
  );
  const endDate = moment(dateRange?.to || new Date());

  const { data: messagesPagination, isPending: isLoadingMessages } =
    useMessages({
      page,
      startDate,
      endDate,
      fromEmail,
      toEmail,
      statuses,
    });

  const { data: messageInsights, isPending: isLoadingInsights } =
    useMessageInsights({
      startDate,
      endDate,
      fromEmail,
      toEmail,
      statuses,
    });

  const { data: messageStatuses } = useMessageStatuses();

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('page', page.toString());

    if (dateRange?.from) {
      params.set('startDate', moment(dateRange.from).format('YYYY-MM-DD'));
    }

    if (dateRange?.to) {
      params.set('endDate', moment(dateRange.to).format('YYYY-MM-DD'));
    }

    if (fromEmail) {
      params.set('fromEmail', fromEmail);
    }

    if (toEmail) {
      params.set('toEmail', toEmail);
    }

    if (statuses.length > 0) {
      params.set('statuses', JSON.stringify(statuses));
    }

    router.push(`/sending-history?${params.toString()}`);
  }, [page, dateRange, fromEmail, toEmail, statuses, router]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    setPage(1);
  };

  const handleFiltersChange = (filters: {
    fromEmail: string;
    toEmail: string;
    statuses: string[];
  }) => {
    setFromEmail(filters.fromEmail);
    setToEmail(filters.toEmail);
    setStatuses(filters.statuses);
    setPage(1);
  };

  const columns = createColumns(messageStatuses);

  return (
    <Container header>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-2xl">
            <span className="font-bold">Your</span> sending history
          </h1>

          <div className="flex gap-2">
            <Filters
              fromEmail={fromEmail}
              toEmail={toEmail}
              statuses={statuses}
              onFiltersChange={handleFiltersChange}
            />
            <DateFilter
              dateRange={dateRange}
              onDateRangeChange={handleDateRangeChange}
            />
          </div>
        </div>

        <InsightsChart data={messageInsights} isLoading={isLoadingInsights} />

        {isLoadingMessages ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <div className="rounded-xl bg-zinc-900 p-4 w-full">
            <DataTable
              columns={columns}
              data={messagesPagination?.messages || []}
            />
          </div>
        )}

        {messagesPagination && (
          <PaginationControls
            currentPage={page}
            totalPages={messagesPagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </Container>
  );
}
