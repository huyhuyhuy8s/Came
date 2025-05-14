
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserNotifications, markNotificationAsRead, Notification } from '@/services/notificationService';
import { useAuth } from '@/hooks/useAuth';

export function useNotifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const notificationsQuery = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => user ? getUserNotifications(user.id) : Promise.resolve([]),
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
  
  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
    },
  });
  
  const markNotificationRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };
  
  return {
    notifications: notificationsQuery.data || [],
    isLoading: notificationsQuery.isLoading,
    isError: notificationsQuery.isError,
    markAsRead: markNotificationRead,
  };
}
