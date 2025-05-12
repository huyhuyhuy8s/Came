
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

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

// Update order status
export const updateOrderStatus = async (orderId: string, status: string): Promise<Order> => {
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

  return data;
};

// Cancel order
export const cancelOrder = async (orderId: string): Promise<Order> => {
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

  return data;
};
