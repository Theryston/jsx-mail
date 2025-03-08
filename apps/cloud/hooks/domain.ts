import { useQuery } from '@tanstack/react-query';

import api from '@/utils/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Domain } from '@/types/domain';

export function useCreateDomain() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (domain: string) =>
      api.post('/domain', { name: domain }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
    },
  });
}

export function useDomains() {
  return useQuery<Domain[]>({
    queryKey: ['domains'],
    queryFn: () => api.get('/domain').then((res) => res.data),
  });
}

export function useDeleteDomain() {
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
        .delete(`/domain/${id}`, { data: { confirmationKey } })
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
    },
  });
}
