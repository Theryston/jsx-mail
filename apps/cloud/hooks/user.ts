import {
  FullBalance,
  Insight,
  Session,
  TransactionsPagination,
  User,
  Permission,
  AdminUsersPagination,
  UserWebhook,
  Export,
  Price,
} from '@/types/user';
import api from '@/utils/api';
import { PER_PAGE } from '@/utils/constants';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';

export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) =>
      await api.post('/user/auth', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
}

export function useSignUp() {
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      password: string;
      turnstileToken: string;
      utmGroupId?: string;
      phone?: string;
      leadId?: string;
    }) => await api.post('/user', data),
  });
}

export function useCreateSecurityCode() {
  return useMutation({
    mutationFn: async (data: { email: string }) =>
      await api.post('/user/security-code', data),
  });
}

export function useVerifySecurityCode() {
  return useMutation({
    mutationFn: async (data: { securityCode: string; permission: string }) =>
      await api.post('/user/security-code/use', data),
  });
}

export function useValidateEmail() {
  return useMutation({
    mutationFn: async () => await api.put('/user/validate-email'),
  });
}

export function useMe() {
  return useQuery<User>({
    queryKey: ['me'],
    queryFn: async () => await api.get('/user/me').then((res) => res.data),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (data: { newPassword: string }) =>
      await api.post('/user/reset-password', data),
  });
}

export function useSessions() {
  return useQuery<Session[]>({
    queryKey: ['sessions'],
    queryFn: () => api.get('/session').then((res) => res.data),
  });
}

export function useInsights() {
  return useQuery<Insight>({
    queryKey: ['insights'],
    queryFn: async () =>
      await api.get('/user/insights').then((res) => res.data),
  });
}

export function useFullBalance() {
  return useQuery<FullBalance>({
    queryKey: ['full-balance'],
    queryFn: async () => await api.get('/user/balance').then((res) => res.data),
  });
}

export function usePrice() {
  return useQuery<Price>({
    queryKey: ['price'],
    queryFn: async () => await api.get('/user/price').then((res) => res.data),
  });
}

export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: async (data: { amount: number; country: string }) =>
      await api.post('/user/checkout', data).then((res) => res.data),
  });
}

export function useTransactions(page: number) {
  return useQuery<TransactionsPagination>({
    queryKey: ['transactions', page],
    queryFn: async () =>
      await api
        .get(`/user/transactions?page=${page}&take=${PER_PAGE}`)
        .then((res) => res.data),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name: string;
      phone?: string | null;
      birthdate?: Date | null;
    }) => api.put('/user', data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      description: string;
      permissions: string[];
      expirationDate: string | null;
    }) => api.post('/session', data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: () => api.delete('/session').then((res) => res.data),
  });
}

export function usePermissions() {
  return useQuery<Permission[]>({
    queryKey: ['permissions'],
    queryFn: () => api.get('/session/permissions').then((res) => res.data),
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/session?id=${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}

export function useUpdateOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      onboardingStep:
        | 'create_domain'
        | 'verify_domain'
        | 'create_sender'
        | 'send_test_email'
        | 'completed',
    ) =>
      api.put('/user/onboarding', { onboardingStep }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
}

export function useAdminUsers(
  page: number = 1,
  search: string = '',
  take: number = 10,
) {
  return useQuery<AdminUsersPagination>({
    queryKey: ['admin-users', page, search, take],
    queryFn: () =>
      api
        .get(`/user/admin/users?search=${search}&take=${take}&page=${page}`)
        .then((res) => res.data),
  });
}

export function useImpersonateUser() {
  return useMutation({
    mutationFn: (data: { userId: string }) =>
      api.post('/user/admin/users/impersonate', data).then((res) => res.data),
  });
}

export function useCreateBlockPermission() {
  return useMutation({
    mutationFn: (data: { permission: string; userId: string }) =>
      api.post('/user/block-permission', data).then((res) => res.data),
  });
}

export function useDeleteBlockPermission() {
  return useMutation({
    mutationFn: (data: { permission: string; userId: string }) =>
      api.delete('/user/block-permission', { data }).then((res) => res.data),
  });
}

export function useGetBlockedPermissions(userId: string) {
  return useQuery<string[]>({
    queryKey: ['blocked-permissions', userId],
    queryFn: () =>
      api.get(`/user/blocked-permissions/${userId}`).then((res) => res.data),
  });
}

export function useCheckEmail() {
  return useMutation({
    mutationFn: (data: { email: string }) =>
      api
        .post<{ exists: boolean }>('/user/check-email', data)
        .then((res) => res.data),
  });
}

export function useCreateLead() {
  return useMutation({
    mutationFn: (data: { email: string; name: string; phone?: string }) =>
      api.post('/user/lead', data).then((res) => res.data),
  });
}

export function useForceSendMessageWebhook() {
  return useMutation({
    mutationFn: (data: { id: string; status: string }) =>
      api
        .post(`/user/messages/${data.id}/webhook`, data)
        .then((res) => res.data),
  });
}

export function useCreateUserWebhook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { url: string; status: string[] }) =>
      api.post('/user/webhook', data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-webhooks'] });
    },
  });
}

export function useDeleteUserWebhook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/user/webhook/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-webhooks'] });
    },
  });
}

export function useListUserWebhooks() {
  return useQuery<UserWebhook[]>({
    queryKey: ['user-webhooks'],
    queryFn: () => api.get('/user/webhooks').then((res) => res.data),
  });
}

export function useExportMessages() {
  return useMutation({
    mutationFn: (data: {
      format: string;
      startDate: string;
      endDate: string;
      statuses: string;
    }) => api.post('/user/messages/export', data).then((res) => res.data),
  });
}

export function useGetExportMessages(id: string | null, status: string | null) {
  return useQuery<Export>({
    queryKey: ['export-messages', id],
    queryFn: () =>
      api.get(`/user/messages/export/${id}`).then((res) => res.data),
    enabled: !!id,
    refetchInterval:
      status === 'pending' || status === 'processing' ? 1000 : false,
  });
}

export function useUpdateUserPriority() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { userId: string; isUserPriority: boolean }) =>
      api.post('/user/admin/users/priority', data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });
}
