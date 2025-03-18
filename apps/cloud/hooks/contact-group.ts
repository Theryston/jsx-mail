import { useQuery } from '@tanstack/react-query';
import api from '@/utils/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ContactGroupsPagination } from '@/types/contact-group';

export const PER_PAGE = 10;

export function useCreateContactGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => {
      return api
        .post('/bulk-sending/contact-group', { name })
        .then((res) => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactGroups'] });
    },
  });
}

export function useContactGroups(page: number = 1) {
  return useQuery<ContactGroupsPagination>({
    queryKey: ['contactGroups', page],
    queryFn: () =>
      api
        .get(`/bulk-sending/contact-group?page=${page}&take=${PER_PAGE}`)
        .then((res) => res.data),
  });
}

export function useDeleteContactGroup() {
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
        .delete(`/bulk-sending/contact-group/${id}`, {
          data: { confirmationKey },
        })
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactGroups'] });
    },
  });
}
