import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/api';
import { Settings, UserSettings } from '@/types/settings';

export function useDefaultSettings() {
  return useQuery({
    queryKey: ['default-settings'],
    queryFn: async () => {
      const { data } = await api.get<Settings>('/user/settings/default');
      return data;
    },
  });
}

export function useUpdateDefaultSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Settings) => {
      const { data } = await api.put<Settings>(
        '/user/settings/default',
        settings,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['default-settings'] });
    },
  });
}

export function useUserSettings(userId: string) {
  return useQuery({
    queryKey: ['user-settings', userId],
    queryFn: async () => {
      const { data } = await api.get<Settings>(`/user/settings/user/${userId}`);
      return data;
    },
    enabled: !!userId,
  });
}

export function useUpdateUserSettings(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: UserSettings) => {
      const { data } = await api.put<UserSettings>(
        `/user/settings/user/${userId}`,
        settings,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-settings', userId] });
    },
  });
}

export function useDeleteUserSettings(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.delete(`/user/settings/user/${userId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-settings', userId] });
    },
  });
}
