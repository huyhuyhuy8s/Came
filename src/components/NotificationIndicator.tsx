
import React from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';

interface NotificationIndicatorProps {
  onClick: () => void;
}

const NotificationIndicator: React.FC<NotificationIndicatorProps> = ({ onClick }) => {
  const { notifications, isLoading } = useNotifications();
  
  // Only count unread notifications (this was missing in the original)
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="relative"
      onClick={onClick}
      disabled={isLoading}
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Button>
  );
};

export default NotificationIndicator;
