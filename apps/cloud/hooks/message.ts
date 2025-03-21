import { useQuery } from '@tanstack/react-query';
import api from '@/utils/api';
import {
  MessageInsightsResponse,
  MessagesPagination,
  Status,
} from '@/types/message';
import moment from 'moment';

export const PER_PAGE = 10;

export interface MessageFilters {
  page: number;
  startDate: moment.Moment;
  endDate: moment.Moment;
  fromEmail?: string;
  toEmail?: string;
  statuses?: string[];
  bulkSending?: string;
}

export function useMessages(filters: MessageFilters) {
  const searchParams = new URLSearchParams();
  searchParams.set('page', filters.page.toString());
  searchParams.set('take', PER_PAGE.toString());
  searchParams.set('startDate', filters.startDate.format('YYYY-MM-DD'));
  searchParams.set('endDate', filters.endDate.format('YYYY-MM-DD'));

  if (filters.statuses && filters.statuses.length > 0) {
    searchParams.set('statuses', JSON.stringify(filters.statuses));
  }

  if (filters.fromEmail) {
    searchParams.set('fromEmail', filters.fromEmail);
  }

  if (filters.toEmail) {
    searchParams.set('toEmail', filters.toEmail);
  }

  if (filters.bulkSending) {
    searchParams.set('bulkSending', filters.bulkSending);
  }

  return useQuery<MessagesPagination>({
    queryKey: ['messages', filters],
    queryFn: () =>
      api
        .get(`/user/messages?${searchParams.toString()}`)
        .then((res) => res.data),
  });
}

export function useMessageInsights(filters: Omit<MessageFilters, 'page'>) {
  const searchParams = new URLSearchParams();
  searchParams.set('startDate', filters.startDate.format('YYYY-MM-DD'));
  searchParams.set('endDate', filters.endDate.format('YYYY-MM-DD'));

  if (filters.statuses && filters.statuses.length > 0) {
    searchParams.set('statuses', JSON.stringify(filters.statuses));
  }

  if (filters.fromEmail) {
    searchParams.set('fromEmail', filters.fromEmail);
  }

  if (filters.toEmail) {
    searchParams.set('toEmail', filters.toEmail);
  }

  if (filters.bulkSending) {
    searchParams.set('bulkSending', filters.bulkSending);
  }

  return useQuery<MessageInsightsResponse>({
    queryKey: ['messages-insights', filters],
    queryFn: () =>
      api
        .get(`/user/messages/insights?${searchParams.toString()}`)
        .then((res) => res.data),
  });
}

export function useMessageStatuses() {
  return useQuery<Status[]>({
    queryKey: ['message-statuses'],
    queryFn: () => api.get('/user/messages/status').then((res) => res.data),
  });
}
