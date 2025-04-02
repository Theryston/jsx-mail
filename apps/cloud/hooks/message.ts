import { useQuery } from '@tanstack/react-query';
import api from '@/utils/api';
import {
  FullMessage,
  MessageInsightsResponse,
  MessagesPagination,
  Status,
} from '@/types/message';
import moment from 'moment';
import { PER_PAGE } from '@/utils/constants';

export interface MessageFilters {
  page: number;
  startDate: moment.Moment;
  endDate: moment.Moment;
  fromEmail?: string;
  toEmail?: string;
  statuses?: string[];
  bulkSending?: string;
}

export function useMessagesFilters(
  filters: MessageFilters | Omit<MessageFilters, 'page'>,
) {
  const searchParams = new URLSearchParams();

  searchParams.set('startDate', filters.startDate.toISOString());
  searchParams.set('endDate', filters.endDate.toISOString());

  if ('page' in filters) {
    searchParams.set('page', filters.page.toString());
    searchParams.set('take', PER_PAGE.toString());
  }

  if (filters.statuses && filters.statuses.length > 0) {
    searchParams.set('statuses', filters.statuses.join(','));
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

  return searchParams;
}

export function useMessages(
  filters: MessageFilters,
  refreshInterval: number | false,
) {
  const searchParams = useMessagesFilters(filters);

  return useQuery<MessagesPagination>({
    queryKey: ['messages', filters],
    queryFn: () =>
      api
        .get(`/user/messages?${searchParams.toString()}`)
        .then((res) => res.data),
    refetchInterval: refreshInterval,
  });
}

export function useMessageInsights(
  filters: Omit<MessageFilters, 'page'>,
  refreshInterval: number | false,
) {
  const searchParams = useMessagesFilters(filters);

  return useQuery<MessageInsightsResponse>({
    queryKey: ['messages-insights', filters],
    queryFn: () =>
      api
        .get(`/user/messages/insights?${searchParams.toString()}`)
        .then((res) => res.data),
    refetchInterval: refreshInterval,
  });
}

export function useMessageStatuses() {
  return useQuery<Status[]>({
    queryKey: ['message-statuses'],
    queryFn: () => api.get('/user/messages/status').then((res) => res.data),
  });
}

export function useMessage(id: string) {
  return useQuery<FullMessage>({
    queryKey: ['message', id],
    queryFn: () => api.get(`/user/messages/${id}`).then((res) => res.data),
  });
}
