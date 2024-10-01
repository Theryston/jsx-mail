'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { PER_PAGE } from './constants';
import {
  Button,
  Input,
  Pagination,
  Popover,
  PopoverContent,
  PopoverTrigger,
  RangeCalendar,
  Select,
  SelectItem,
} from '@nextui-org/react';
import Table from '../Table';
import type { Message } from './types';
import { Pagination as PaginationType, Status } from '../types';
import useSWR from 'swr';
import fetcher from '@/app/utils/fetcher';
import moment, { Moment } from 'moment';
import { Calendar, Filter } from 'iconsax-react';
import { getLocalTimeZone, parseDate, today } from '@internationalized/date';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sender } from '../senders/types';

type MessagesPagination = PaginationType & {
  messages: Message[];
};

export default function SendingHistoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState<Moment>(
    searchParams?.get('startDate')
      ? moment(searchParams?.get('startDate'))
      : moment().subtract(30, 'days'),
  );
  const [endDate, setEndDate] = useState<Moment>(
    searchParams?.get('endDate')
      ? moment(searchParams?.get('endDate'))
      : moment(),
  );
  const [fromEmail, setFromEmail] = useState(
    searchParams?.get('fromEmail') || '',
  );
  const [toEmail, setToEmail] = useState(searchParams?.get('toEmail') || '');
  const [statuses, setStatuses] = useState<string[]>(
    searchParams?.get('statuses')
      ? JSON.parse(searchParams?.get('statuses') || '')
      : [],
  );

  const searchParamsRequest = new URLSearchParams();
  searchParamsRequest.set('page', page.toString());
  searchParamsRequest.set('take', PER_PAGE.toString());
  searchParamsRequest.set('startDate', startDate.format('YYYY-MM-DD'));
  searchParamsRequest.set('endDate', endDate.format('YYYY-MM-DD'));
  searchParamsRequest.set('statuses', JSON.stringify(statuses));
  if (fromEmail) searchParamsRequest.set('fromEmail', fromEmail);
  if (toEmail) searchParamsRequest.set('toEmail', toEmail);

  const { data: messagesPagination, isLoading } = useSWR<MessagesPagination>(
    `/user/messages?${searchParamsRequest.toString()}`,
    fetcher,
  );

  useEffect(() => {
    if (!startDate || !endDate || !page || !searchParams) return;
    const customSearchParams = new URLSearchParams(searchParams.toString());
    customSearchParams.set('startDate', startDate.format('YYYY-MM-DD'));
    customSearchParams.set('endDate', endDate.format('YYYY-MM-DD'));
    customSearchParams.set('page', page.toString());
    customSearchParams.set('fromEmail', fromEmail);
    customSearchParams.set('toEmail', toEmail);
    customSearchParams.set('statuses', JSON.stringify(statuses));
    router.push(`?${customSearchParams.toString()}`);
  }, [
    endDate,
    startDate,
    page,
    searchParams,
    router,
    fromEmail,
    toEmail,
    statuses,
  ]);

  return (
    <>
      <h1 className="text-2xl">
        <span className="font-bold">Your</span> sending history
      </h1>

      <div className="flex items-center justify-between">
        <AllFilters
          setFromEmail={setFromEmail}
          setToEmail={setToEmail}
          setStatuses={setStatuses}
          fromEmail={fromEmail}
          toEmail={toEmail}
          statuses={statuses}
        />
        <DateFilter
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          startDate={startDate}
          endDate={endDate}
        />
      </div>

      <div>
        <Table
          isLoading={isLoading}
          columns={['ID', 'Sender', 'To', 'Subject', 'Status', 'Sent at']}
          rows={
            messagesPagination?.messages.map((message) => [
              message.id,
              message.sender.email,
              message.to,
              message.subject,
              message.status,
              moment(message.sentAt).format('DD MMM YY'),
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

const filtersSchema = z.object({
  fromEmail: z.string().optional(),
  toEmail: z.string().optional(),
  statuses: z.string().optional(),
});

type Filters = z.infer<typeof filtersSchema>;

type AllFiltersProps = {
  setFromEmail: React.Dispatch<React.SetStateAction<string>>;
  setToEmail: React.Dispatch<React.SetStateAction<string>>;
  setStatuses: React.Dispatch<React.SetStateAction<string[]>>;
  statuses: string[];
  fromEmail: string;
  toEmail: string;
};

function isEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function AllFilters({
  setFromEmail,
  setToEmail,
  setStatuses: propsSetStatuses,
  statuses: propsStatuses,
  fromEmail,
  toEmail,
}: AllFiltersProps) {
  const { data: senders } = useSWR<Sender[]>('/sender', fetcher);
  const { data: statuses } = useSWR<Status[]>('/user/messages/status', fetcher);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Filters>({
    resolver: zodResolver(filtersSchema),
  });

  const onSubmit = useCallback(
    (data: Filters) => {
      const statusesParts = data.statuses?.split(',').filter((s) => s) || [];
      (data as any).statuses = statusesParts || [];

      if (data.fromEmail && !isEmail(data.fromEmail)) {
        setError('fromEmail', { message: 'Invalid email' });
        return;
      }

      if (data.toEmail && !isEmail(data.toEmail)) {
        setError('toEmail', { message: 'Invalid email' });
        return;
      }

      setFromEmail(data.fromEmail || '');
      setToEmail(data.toEmail || '');
      propsSetStatuses((data.statuses as any) || []);
    },
    [setFromEmail, setToEmail, setError, statuses, propsSetStatuses],
  );

  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <Button className="h-full" radius="full">
          <div className="flex items-center gap-2 text-zinc-300">
            <Filter size="0.8rem" variant="Bold" />
            <span>Filters</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px]">
        {(titleProps) => (
          <form
            className="px-1 py-2 w-full flex flex-col gap-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <p className="text-small font-bold text-foreground" {...titleProps}>
              Filters
            </p>

            <Input
              label="To"
              size="sm"
              variant="bordered"
              isInvalid={!!errors.toEmail}
              description={errors.toEmail?.message}
              isClearable
              {...register('toEmail')}
              defaultValue={toEmail}
            />

            <Select
              label="Sender"
              size="sm"
              variant="bordered"
              items={senders?.map((sender) => ({
                label: sender.email,
                value: sender.email,
              }))}
              defaultSelectedKeys={[fromEmail]}
              isInvalid={!!errors.fromEmail}
              description={errors.fromEmail?.message}
              {...register('fromEmail')}
            >
              {(item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              )}
            </Select>

            <Select
              label="Status"
              size="sm"
              variant="bordered"
              items={statuses?.map((status) => ({
                label: status.label,
                value: status.value,
              }))}
              selectionMode="multiple"
              defaultSelectedKeys={propsStatuses}
              isInvalid={!!errors.statuses}
              description={errors.statuses?.message}
              {...register('statuses')}
            >
              {(item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              )}
            </Select>

            <Button type="submit" size="sm" color="primary" className="mt-2">
              Apply
            </Button>
          </form>
        )}
      </PopoverContent>
    </Popover>
  );
}

type DateFilterProps = {
  setStartDate: React.Dispatch<React.SetStateAction<Moment>>;
  setEndDate: React.Dispatch<React.SetStateAction<Moment>>;
  startDate: Moment;
  endDate: Moment;
};

function DateFilter({
  setStartDate,
  setEndDate,
  startDate,
  endDate,
}: DateFilterProps) {
  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <div>
          <Input
            value={`${startDate.format('DD MMM YY')} - ${endDate.format('DD MMM YY')}`}
            readOnly
            size="sm"
            className="max-w-52 cursor-pointer flex-shrink-0"
            endContent={
              <div className="pr-1">
                <Calendar
                  variant="Bold"
                  size="1.25rem"
                  className="cursor-pointer text-zinc-300"
                />
              </div>
            }
            classNames={{
              inputWrapper: 'rounded-full',
              input: 'cursor-pointer text-sm !text-zinc-300 px-2',
            }}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="bg-transparent p-0 rounded-none">
        <RangeCalendar
          value={{
            end: parseDate(endDate.toISOString().split('T')[0]),
            start: parseDate(startDate.toISOString().split('T')[0]),
          }}
          maxValue={today(getLocalTimeZone())}
          onChange={(value) => {
            setStartDate(moment(value.start.toDate(getLocalTimeZone())));
            setEndDate(moment(value.end.toDate(getLocalTimeZone())));
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
