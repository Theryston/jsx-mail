import { useQuery } from '@tanstack/react-query';
import api from '@/utils/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  BulkSendingsPagination,
  ContactGroup,
  ContactGroupContactsPagination,
  ContactGroupsPagination,
  ContactImport,
  ContactImportFailuresPagination,
  BulkSendingFailuresPagination,
  BulkEmailCheck,
  BulkEmailCheckEstimate,
  EmailCheckLevel,
} from '@/types/bulk-sending';
import { PER_PAGE } from '@/utils/constants';

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
  filter:
    | 'all'
    | 'bounced_email_check'
    | 'bounced_message'
    | 'not_bounced' = 'all',
) {
  return useQuery<ContactGroupContactsPagination>({
    queryKey: ['contactGroupContacts', id, page, search, filter],
    queryFn: () =>
      api
        .get(
          `/bulk-sending/contact-group/${id}/contacts?page=${page}&take=${PER_PAGE}&search=${search}&filter=${filter}`,
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

export function useContactImports(
  groupId: string,
  options?: { refetchInterval?: number | false },
) {
  return useQuery<ContactImport[]>({
    queryKey: ['contactImports', groupId],
    queryFn: () =>
      api
        .get(`/bulk-sending/contact-import/${groupId}`)
        .then((res) => res.data),
    ...options,
  });
}

export function useCreateContactImport(groupId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      fileId,
      emailColumn,
      nameColumn,
    }: {
      fileId: string;
      emailColumn: string;
      nameColumn: string;
    }) =>
      api.post(`/bulk-sending/contact-import/${groupId}`, {
        fileId,
        emailColumn,
        nameColumn,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactImports', groupId] });
    },
  });
}

export function useMarkContactImportAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contactImportId: string) =>
      api
        .put(`/bulk-sending/contact-import/${contactImportId}/read`)
        .then((res) => res.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['contactImports', data.contactGroupId],
      });
    },
  });
}

export function useContactImportFailures(
  contactImportId?: string,
  page?: number,
) {
  if (!page) page = 1;

  return useQuery<ContactImportFailuresPagination>({
    queryKey: ['contactImportFailures', contactImportId, page],
    queryFn: () =>
      api
        .get(
          `/bulk-sending/contact-import/${contactImportId}/failures?page=${page}&take=${PER_PAGE}`,
        )
        .then((res) => res.data),
    enabled: !!contactImportId && !!page,
  });
}

export function useCreateBulkSending() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: {
      title: string;
      subject: string;
      content: string;
      sender: string;
      contactGroupId: string;
      variables: {
        key: string;
        from: string;
        fromKey: string;
        customValue?: string;
      }[];
    }) => api.post('/bulk-sending', body).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bulkSending'] });
    },
  });
}

export function useBulkSending(
  {
    page = 1,
    take = PER_PAGE,
  }: {
    page?: number;
    take?: number;
  },
  refetchInterval?: number | false,
) {
  return useQuery<BulkSendingsPagination>({
    queryKey: ['bulkSending', page, take],
    queryFn: () =>
      api
        .get(`/bulk-sending?page=${page}&take=${take}`)
        .then((res) => res.data),
    ...(refetchInterval ? { refetchInterval } : {}),
  });
}

export function useBulkSendingFailures(bulkSendingId?: string, page?: number) {
  if (!page) page = 1;

  return useQuery<BulkSendingFailuresPagination>({
    queryKey: ['bulkSendingFailures', bulkSendingId, page],
    queryFn: () =>
      api
        .get(
          `/bulk-sending/${bulkSendingId}/failures?page=${page}&take=${PER_PAGE}`,
        )
        .then((res) => res.data),
    enabled: !!bulkSendingId && !!page,
  });
}

export function useContactUnsubscribe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (key: string) =>
      api.post(`/bulk-sending/unsubscribe/${key}`).then((res) => res.data),
    onSuccess: (_data, key) => {
      queryClient.invalidateQueries({ queryKey: ['contactExists', key] });
    },
  });
}

export function useContactExists(key: string | null) {
  return useQuery({
    queryKey: ['contactExists', key],
    queryFn: () =>
      api.get(`/bulk-sending/unsubscribe/${key}`).then((res) => res.data),
    enabled: !!key,
  });
}

export function useCreateBulkEmailCheck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: { contactGroupId: string; level: EmailCheckLevel }) =>
      api.post('/bulk-sending/email-check', body).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bulkEmailChecks'] });
    },
  });
}

export function useListBulkEmailChecks(
  contactGroupId: string,
  refetchInterval?: number | false,
) {
  return useQuery<BulkEmailCheck[]>({
    queryKey: ['bulkEmailChecks', contactGroupId],
    queryFn: () =>
      api
        .get(`/bulk-sending/email-check/${contactGroupId}`)
        .then((res) => res.data),
    ...(refetchInterval ? { refetchInterval } : {}),
  });
}

export function useEstimateBulkEmailCheck(
  contactGroupId: string,
  totalEmails: number,
  customEmailsTotal?: number,
) {
  return useQuery<BulkEmailCheckEstimate>({
    queryKey: [
      'estimateBulkEmailCheck',
      contactGroupId,
      totalEmails,
      customEmailsTotal,
    ],
    queryFn: () =>
      api
        .get(
          `/bulk-sending/email-check/estimate/${contactGroupId}?customEmailsTotal=${customEmailsTotal}`,
        )
        .then((res) => res.data),
  });
}

export function useMarkBulkEmailCheckAsRead(
  bulkEmailCheckId: string,
  contactGroupId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      api
        .put(`/bulk-sending/email-check/${bulkEmailCheckId}/read`)
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['bulkEmailChecks', contactGroupId],
      });
    },
  });
}

export function useRestartBulkSending() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bulkSendingId: string) =>
      api
        .post(`/bulk-sending/${bulkSendingId}/restart`)
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bulkSending'] });
    },
  });
}
