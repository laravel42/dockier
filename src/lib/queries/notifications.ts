import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "@/lib/api";
import { queryKeys } from "./keys";

export function useNotifications(unreadOnly?: boolean) {
  return useQuery({
    queryKey: queryKeys.notifications.list(unreadOnly),
    queryFn: () => notificationsApi.list(unreadOnly).then((r) => r.notifications),
  });
}

export function useNotificationChannels() {
  return useQuery({
    queryKey: queryKeys.notifications.channels(),
    queryFn: () => notificationsApi.listChannels().then((r) => r.channels),
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string) => notificationsApi.markRead(notificationId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}

export function useToggleNotificationChannel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { channelId: string; enabled: boolean }) =>
      notificationsApi.toggleChannel(vars.channelId, vars.enabled),
    onSuccess: () => {
      void qc.invalidateQueries({
        queryKey: queryKeys.notifications.channels(),
      });
    },
  });
}

export function useAddNotificationChannel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notificationsApi.addChannel,
    onSuccess: () => {
      void qc.invalidateQueries({
        queryKey: queryKeys.notifications.channels(),
      });
    },
  });
}

export function useDeleteNotificationChannel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (channelId: string) => notificationsApi.deleteChannel(channelId),
    onSuccess: () => {
      void qc.invalidateQueries({
        queryKey: queryKeys.notifications.channels(),
      });
    },
  });
}
