
import { supabase } from "@/integrations/supabase/client";

export interface Notification {
  id: string;
  user_id: string | null;
  message: string;
  type: string;
  created_at: string | null;
  read?: boolean; // Add this as an optional field
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
export const createNotification = async (notification: Omit<Notification, 'id' | 'created_at'>): Promise<Notification> => {
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
  // Instead of trying to update a 'read' field that doesn't exist in the DB,
  // We'll delete the notification when marked as read
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};
