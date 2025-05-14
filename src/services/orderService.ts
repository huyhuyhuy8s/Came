
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import * as notificationService from "@/services/notificationService";

export interface Order {
  id: string;
  user_id: string | null;
  subtotal: number;
  tax: number;
  tip: number | null;
  delivery_fee: number | null;
  total: number;
  delivery_option: string;
  delivery_address: string | null;
  delivery_time: string | null;
  status: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface OrderItem {
  id: string;
  order_id: string | null;
  product_id: string | null;
  product_name: string;
  quantity: number;
  options: any[]; // Change to any[] to match expected type
  price: number;
  size: string | null;
}

// Create order
export const createOrder = async (orderData: Omit<Order, 'id'>): Promise<Order> => {
  const { data, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();

  if (error) {
    console.error('Error creating order:', error);
    throw error;
  }

  // Create notification for new order
  if (orderData.user_id) {
    try {
      await notificationService.createNotification({
        user_id: orderData.user_id,
        message: `Your order #${data.id.substring(0, 8)} has been received and is being processed.`,
        type: 'order_placed'
      });
    } catch (notifyError) {
      console.error('Error creating order notification:', notifyError);
      // Don't fail the order creation if notification fails
    }
  }

  return data;
};

// Add order item
export const addOrderItem = async (item: Omit<OrderItem, 'id'>): Promise<OrderItem> => {
  const { data, error } = await supabase
    .from('order_items')
    .insert(item)
    .select()
    .single();

  if (error) {
    console.error('Error adding order item:', error);
    throw error;
  }

  // Convert Json options to array
  return {
    ...data,
    options: Array.isArray(data.options) ? data.options : []
  };
};

// Get user orders
export const getUserOrders = async (userId: string): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }

  return data || [];
};

// Get order by id
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching order:', error);
    throw error;
  }

  return data;
};

// Get order items
export const getOrderItems = async (orderId: string): Promise<OrderItem[]> => {
  const { data, error } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId);

  if (error) {
    console.error('Error fetching order items:', error);
    throw error;
  }

  // Convert Json options to array
  return (data || []).map(item => ({
    ...item,
    options: Array.isArray(item.options) ? item.options : []
  }));
};

// Get order feedback status
export const getOrderFeedbackStatus = async (orderId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('order_feedback')
    .select('id')
    .eq('order_id', orderId)
    .maybeSingle();

  if (error) {
    console.error('Error checking feedback status:', error);
    throw error;
  }

  return !!data; // Return true if feedback exists, false otherwise
};

// Update order status with notification
export const updateOrderStatus = async (orderId: string, status: string, userId?: string | null): Promise<Order> => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single();

  if (error) {
    console.error('Error updating order status:', error);
    throw error;
  }

  // Create notification for status update if we have a user ID
  if (userId) {
    try {
      let message = '';
      switch(status) {
        case 'preparing':
          message = `Your order #${orderId.substring(0, 8)} is now being prepared.`;
          break;
        case 'packing':
          message = `Your order #${orderId.substring(0, 8)} is being packed.`;
          break;
        case 'delivering':
          message = `Your order #${orderId.substring(0, 8)} is on the way!`;
          break;
        case 'completed':
          message = `Your order #${orderId.substring(0, 8)} has been delivered. Enjoy!`;
          break;
        case 'cancelled':
          message = `Your order #${orderId.substring(0, 8)} has been cancelled.`;
          break;
        default:
          message = `Your order #${orderId.substring(0, 8)} status has been updated to ${status}.`;
      }

      await notificationService.createNotification({
        user_id: userId,
        message,
        type: 'order_status'
      });
    } catch (notifyError) {
      console.error('Error creating status notification:', notifyError);
      // Don't fail the order update if notification fails
    }
  }

  return data;
};

// Cancel order
export const cancelOrder = async (orderId: string): Promise<Order> => {
  // First get the order to get the user_id
  const order = await getOrderById(orderId);
  
  const { data, error } = await supabase
    .from('orders')
    .update({ status: 'cancelled' })
    .eq('id', orderId)
    .select()
    .single();

  if (error) {
    console.error('Error cancelling order:', error);
    throw error;
  }

  // Create cancellation notification
  if (order && order.user_id) {
    try {
      await notificationService.createNotification({
        user_id: order.user_id,
        message: `Your order #${orderId.substring(0, 8)} has been cancelled.`,
        type: 'order_status'
      });
    } catch (notifyError) {
      console.error('Error creating cancellation notification:', notifyError);
    }
  }

  return data;
};
