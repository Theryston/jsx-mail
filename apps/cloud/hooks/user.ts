import { FullBalance, Insight, Session, User } from '@/types/user';
import api from '@/utils/api';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';

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

export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) =>
      await api.delete(`/session?id=${sessionId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}

export function useSessions() {
  return useQuery<Session[]>({
    queryKey: ['sessions'],
    queryFn: async () => await api.get('/session').then((res) => res.data),
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
