import {
  FullBalance,
  Insight,
  Session,
  TransactionsPagination,
  User,
  Permission,
} from '@/types/user';
import api from '@/utils/api';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';

export const PER_PAGE = 10;

export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => await api.post('/user/auth', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
}

export function useSignUp() {
  return useMutation({
    mutationFn: async (data: any) => await api.post('/user', data),
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
