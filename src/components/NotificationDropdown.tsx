
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserNotifications, markNotificationAsRead, Notification } from '@/services/notificationService';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface NotificationDropdownProps {
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Query notifications for the logged-in user
  const { 
    data: notifications = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => user ? getUserNotifications(user.id) : Promise.resolve([]),
    enabled: !!user
  });

  // Filter to show only unread notifications first
  const sortedNotifications = [...notifications].sort((a, b) => {
    // First sort by read status (unread first)
    if ((a.read === false && b.read === true) || (a.read === null && b.read === true)) return -1;
    if ((a.read === true && b.read === false) || (a.read === true && b.read === null)) return 1;
    // Then sort by creation date
    return new Date(b.created_at || '') > new Date(a.created_at || '') ? 1 : -1;
  });

  // Mutation to mark notification as read
  const { mutate: markAsRead } = useMutation({
    mutationFn: (notificationId: string) => markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
      console.error("Error marking notification as read:", error);
    }
  });

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId);
  };

  const formatNotificationTime = (timestamp: string | null) => {
    if (!timestamp) return 'Unknown';
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'order_placed':
        return <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>;
      case 'order_status':
        return <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>;
      case 'system':
        return <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>;
    }
  };

  return (
    <Card className="shadow-lg border rounded-md overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <h3 className="font-semibold">Notifications</h3>
      </div>
      
      {isLoading ? (
        <div className="p-4 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-black mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Loading notifications...</p>
        </div>
      ) : error ? (
        <div className="p-4 text-center">
          <p className="text-sm text-gray-500">Could not load notifications</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="p-4 text-center">
          <p className="text-sm text-gray-500">No notifications yet</p>
        </div>
      ) : (
        <ScrollArea className="h-[300px]">
          <ul className="divide-y">
            {sortedNotifications.map((notification: Notification) => (
              <li key={notification.id} className={`p-4 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center">
                      {getTypeIcon(notification.type)}
                      <span className="text-xs text-gray-500">{formatNotificationTime(notification.created_at)}</span>
                      {!notification.read && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">New</span>
                      )}
                    </div>
                    <p className="text-sm mt-1">{notification.message}</p>
                  </div>
                  {!notification.read && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleMarkAsRead(notification.id)}
                      title="Mark as read"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      )}
      
      <div className="p-2 border-t bg-gray-50 text-center">
        <button 
          className="text-xs text-blue-600 hover:underline"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </Card>
  );
};

export default NotificationDropdown;
