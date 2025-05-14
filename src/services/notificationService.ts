
import { supabase } from "@/integrations/supabase/client";

export interface Notification {
  id: string;
  user_id: string | null;
  message: string;
  type: string;
  created_at: string | null;
  read: boolean | null; // Updated to be a proper boolean
}

// Get user notifications
export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }

  return data || [];
};

// Create notification
export const createNotification = async (notification: Omit<Notification, 'id' | 'created_at' | 'read'>): Promise<Notification> => {
  const { data, error } = await supabase
    .from('notifications')
    .insert(notification)
    .select()
    .single();

  if (error) {
    console.error('Error creating notification:', error);
    throw error;
  }

  return data;
};

// Mark notification as read
export const markNotificationAsRead = async (id: string): Promise<void> => {
  // Updated to mark as read instead of deleting
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', id);

  if (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};
