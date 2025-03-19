import { useQuery } from '@tanstack/react-query';
import api from '@/utils/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Sender } from '@/types/sender';
import { Domain } from '@/types/domain';

export function useCreateSender() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name: string;
      domainName: string;
      username: string;
    }) => api.post('/sender', data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['senders'] });
    },
  });
}

export function useSenders() {
  return useQuery<Sender[]>({
    queryKey: ['senders'],
    queryFn: () => api.get('/sender').then((res) => res.data),
  });
}

export function useDeleteSender() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      confirmationKey,
    }: {
      id: string;
      confirmationKey: string;
    }) =>
      api
        .delete(`/sender/${id}`, { data: { confirmationKey } })
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['senders'] });
    },
  });
}

export function useVerifiedDomains() {
  return useQuery<Domain[]>({
    queryKey: ['domains', 'verified'],
    queryFn: () =>
      api
        .get('/domain', { params: { status: 'verified' } })
        .then((res) => res.data),
  });
}

export function useSendEmail() {
  return useMutation({
    mutationFn: (data: {
      subject: string;
      html: string;
      to: string[];
      sender: string;
    }) => api.post('/sender/send', data).then((res) => res.data),
  });
}
