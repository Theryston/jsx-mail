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
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => await api.get('/user/me'),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (data: { newPassword: string }) =>
      await api.post('/user/reset-password', data),
  });
}
