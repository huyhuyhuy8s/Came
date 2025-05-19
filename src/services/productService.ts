
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price_min: number;
  price_max: number;
  image_url: string | null;
  category_id: string | null;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
}

export interface ProductOption {
  id: string;
  label: string;
  value: string;
  price_adjustment: number;
}

export interface ProductSize {
  id: string;
  label: string;
  value: string;
  price: number;
}

export interface IceOption {
  id: string;
  label: string;
  value: string;
  price_adjustment: number;
}

export interface SugarOption {
  id: string;
  label: string;
  value: string;
  price_adjustment: number;
}

// Get all products
export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*');

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }

  return data || [];
};

// Get product by id
export const getProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Product not found
    }
    console.error('Error fetching product:', error);
    throw error;
  }

  return data;
};

// Get products by category
export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', categoryId);

  if (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }

  return data || [];
};

// Get all categories
export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*');

  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }

  return data || [];
};

// Get product options
export const getProductOptions = async (): Promise<ProductOption[]> => {
  const { data, error } = await supabase
    .from('product_options')
    .select('*');

  if (error) {
    console.error('Error fetching product options:', error);
    throw error;
  }

  return data || [];
};

// Get product sizes
export const getProductSizes = async (): Promise<ProductSize[]> => {
  const { data, error } = await supabase
    .from('product_sizes')
    .select('*');

  if (error) {
    console.error('Error fetching product sizes:', error);
    throw error;
  }

  return data || [];
};

// Get ice options
export const getIceOptions = async (): Promise<IceOption[]> => {
  const { data, error } = await supabase
    .from('ice')
    .select('*');

  if (error) {
    console.error('Error fetching ice options:', error);
    throw error;
  }

  return data || [];
};

// Get sugar options
export const getSugarOptions = async (): Promise<SugarOption[]> => {
  const { data, error } = await supabase
    .from('sugar')
    .select('*');

  if (error) {
    console.error('Error fetching sugar options:', error);
    throw error;
  }

  return data || [];
};
