import { useQuery } from '@tanstack/react-query';
import api from '@/utils/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ContactGroup,
  ContactGroupContactsPagination,
  ContactGroupsPagination,
} from '@/types/contact-group';

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

export function useGetContactGroup(id: string) {
  return useQuery<ContactGroup>({
    queryKey: ['contactGroup', id],
    queryFn: () =>
      api.get(`/bulk-sending/contact-group/${id}`).then((res) => res.data),
  });
}

export function useContactGroupContacts(
  id: string,
  page: number = 1,
  search: string = '',
) {
  return useQuery<ContactGroupContactsPagination>({
    queryKey: ['contactGroupContacts', id, page, search],
    queryFn: () =>
      api
        .get(
          `/bulk-sending/contact-group/${id}/contacts?page=${page}&take=${PER_PAGE}&search=${search}`,
        )
        .then((res) => res.data),
  });
}

export function useDeleteContactGroupContact() {
  return useMutation({
    mutationFn: ({ id, contactId }: { id: string; contactId: string }) =>
      api
        .delete(`/bulk-sending/contact-group/${id}/contacts/${contactId}`)
        .then((res) => res.data),
  });
}
