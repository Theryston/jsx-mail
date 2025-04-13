'use client';

import { Container } from '@/components/container';
import { useState, useEffect, useRef } from 'react';
import { useMessages, useMessageInsights } from '@/hooks/message';
import { Skeleton } from '@jsx-mail/ui/skeleton';
import { DateFilter } from './date-filter';
import { Filters } from './filters';
import { DataTable } from './data-table';
import { columns } from './columns';
import { InsightsChart } from './insights-chart';
import { PaginationControls } from '@jsx-mail/ui/pagination-controls';
import { useSearchParams, useRouter } from 'next/navigation';
import moment from 'moment';
import { DateRange } from 'react-day-picker';
import { ArrowLeftIcon } from 'lucide-react';
import { Button } from '@jsx-mail/ui/button';
import { Alert, AlertDescription } from '@jsx-mail/ui/alert';

export default function SendingHistoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [page, setPage] = useState(1);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [fromEmail, setFromEmail] = useState('');
  const [toEmail, setToEmail] = useState('');
  const [statuses, setStatuses] = useState<string[]>([]);
  const bulkSending = searchParams?.get('bulkSending') || '';
  const isDefaultProcessed = useRef(false);

  useEffect(() => {
    if (isDefaultProcessed.current) return;

    const pageParam = searchParams?.get('page');
    const startDateParam = searchParams?.get('startDate');
    const endDateParam = searchParams?.get('endDate');
    const fromEmailParam = searchParams?.get('fromEmail');
    const toEmailParam = searchParams?.get('toEmail');
    const statusesParam = searchParams?.get('statuses');

    if (pageParam) {
      const numberPage = parseInt(pageParam, 10);
      setPage((prev) => (prev === numberPage ? prev : numberPage));
    }

    if (startDateParam && endDateParam) {
      setDateRange((prev) => {
        const newDateRange = {
          from: moment(startDateParam).startOf('day').toDate(),
          to: moment(endDateParam).endOf('day').toDate(),
        };

        return prev?.from === newDateRange.from && prev?.to === newDateRange.to
          ? prev
          : newDateRange;
      });
    } else {
      setDateRange({
        from: moment().subtract(30, 'days').startOf('day').toDate(),
        to: moment().endOf('day').toDate(),
      });
    }

    if (fromEmailParam) {
      setFromEmail((prev) => (prev === fromEmailParam ? prev : fromEmailParam));
    }

    if (toEmailParam) {
      setToEmail((prev) => (prev === toEmailParam ? prev : toEmailParam));
    }

    if (statusesParam) {
      const statusesArray = JSON.parse(statusesParam);
      setStatuses((prev) =>
        statusesArray.every((status: string) => prev.includes(status))
          ? prev
          : statusesArray,
      );
    }

    isDefaultProcessed.current = true;
  }, [searchParams]);

  const startDate = moment(
    dateRange?.from || moment().subtract(30, 'days').toDate(),
  );
  const endDate = moment(dateRange?.to || new Date());
  const [hasProcessingMessages, setHasProcessingMessages] = useState(false);

  const { data: messagesPagination, isPending: isLoadingMessages } =
    useMessages(
      {
        page,
        startDate,
        endDate,
        fromEmail,
        toEmail,
        statuses,
        bulkSending,
      },
      hasProcessingMessages ? 1000 : false,
    );

  const { data: messageInsights, isPending: isLoadingInsights } =
    useMessageInsights(
      {
        startDate,
        endDate,
        fromEmail,
        toEmail,
        statuses,
        bulkSending,
      },
      hasProcessingMessages ? 1000 : false,
    );

  useEffect(() => {
    if ((messageInsights?.PROCESSING_MESSAGES || 0) > 0) {
      setHasProcessingMessages(true);
    }
  }, [messageInsights]);

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

    if (bulkSending) {
      params.set('bulkSending', bulkSending);
    }

    router.replace(`/sending-history?${params.toString()}`);
  }, [page, dateRange, fromEmail, toEmail, statuses, bulkSending, router]);

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

  return (
    <Container header>
      <div className="flex flex-col gap-4">
        {bulkSending && (
          <Alert className="bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <AlertDescription className="flex flex-col md:flex-row gap-2 items-start md:items-center justify-between">
              <div className="overflow-hidden text-ellipsis">
                Viewing messages from bulk sending:{' '}
                <strong>{bulkSending}</strong>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                className="text-amber-500 border-amber-500/20 hover:bg-amber-500/10 hover:text-amber-500"
              >
                <ArrowLeftIcon className="size-4" />
                Back to bulk sending
              </Button>
            </AlertDescription>
          </Alert>
        )}

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
