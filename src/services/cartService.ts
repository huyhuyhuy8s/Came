
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/services/authService";
import { Json } from "@/integrations/supabase/types";

export interface CartItem {
  id: string;
  cart_id: string | null;
  product_id: string | null;
  quantity: number;
  price: number;
  options: any[]; // Match the expected type
  size: string | null;
  selected_option_id: string | null;
  selected_size_id: string | null;
  selected_ice_id?: string | null;
  selected_sugar_id?: string | null;
}

export interface Cart {
  id: string;
  user_id: string | null;
}

// Get user's cart
export const getUserCart = async (userId: string): Promise<Cart | null> => {
  const { data, error } = await supabase
    .from('carts')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user cart:', error);
    throw error;
  }

  return data;
};

// Create a new cart for user
export const createUserCart = async (userId: string): Promise<Cart> => {
  const { data, error } = await supabase
    .from('carts')
    .insert({ user_id: userId })
    .select()
    .single();

  if (error) {
    console.error('Error creating user cart:', error);
    throw error;
  }

  return data;
};

// Get or create user cart
export const getOrCreateUserCart = async (userId: string): Promise<Cart> => {
  const cart = await getUserCart(userId);
  if (cart) return cart;
  return await createUserCart(userId);
};

// Get cart items
export const getCartItems = async (cartId: string): Promise<CartItem[]> => {
  const { data, error } = await supabase
    .from('cart_items')
    .select('*')
    .eq('cart_id', cartId);

  if (error) {
    console.error('Error fetching cart items:', error);
    throw error;
  }

  // Convert Json options to array
  return (data || []).map(item => ({
    ...item,
    options: Array.isArray(item.options) ? item.options : []
  }));
};

// Add item to cart
export const addItemToCart = async (item: Omit<CartItem, 'id'>): Promise<CartItem> => {
  const { data, error } = await supabase
    .from('cart_items')
    .insert(item)
    .select()
    .single();

  if (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }

  // Convert Json options to array
  return {
    ...data,
    options: Array.isArray(data.options) ? data.options : []
  };
};

// Update cart item
export const updateCartItem = async (id: string, updates: Partial<CartItem>): Promise<CartItem> => {
  const { data, error } = await supabase
    .from('cart_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }

  // Convert Json options to array
  return {
    ...data,
    options: Array.isArray(data.options) ? data.options : []
  };
};

// Remove item from cart
export const removeCartItem = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error removing cart item:', error);
    throw error;
  }
};

// Clear cart
export const clearCart = async (cartId: string): Promise<void> => {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('cart_id', cartId);

  if (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};
