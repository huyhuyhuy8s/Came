export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          image_url: string | null
          category: string
          category_id: string | null
          price_min: number
          price_max: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          image_url?: string | null
          category: string
          category_id?: string | null
          price_min: number
          price_max: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          image_url?: string | null
          category?: string
          category_id?: string | null
          price_min?: number
          price_max?: number
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      product_sizes: {
        Row: {
          id: string
          product_id: string
          value: string
          label: string
          price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          value: string
          label: string
          price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          value?: string
          label?: string
          price?: number
          created_at?: string
          updated_at?: string
        }
      }
      product_options: {
        Row: {
          id: string
          product_id: string
          value: string
          label: string
          price_adjustment: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          value: string
          label: string
          price_adjustment?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          value?: string
          label?: string
          price_adjustment?: number
          created_at?: string
          updated_at?: string
        }
      }
      carts: {
        Row: {
          id: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          cart_id: string
          product_id: string
          quantity: number
          size: string | null
          options: Json
          price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          cart_id: string
          product_id: string
          quantity?: number
          size?: string | null
          options?: Json
          price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          cart_id?: string
          product_id?: string
          quantity?: number
          size?: string | null
          options?: Json
          price?: number
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          status: string
          subtotal: number
          tax: number
          tip: number
          delivery_fee: number
          total: number
          delivery_option: string
          delivery_time: string | null
          delivery_address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          status?: string
          subtotal: number
          tax: number
          tip?: number
          delivery_fee?: number
          total: number
          delivery_option: string
          delivery_time?: string | null
          delivery_address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          status?: string
          subtotal?: number
          tax?: number
          tip?: number
          delivery_fee?: number
          total?: number
          delivery_option?: string
          delivery_time?: string | null
          delivery_address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          quantity: number
          size: string | null
          options: Json
          price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          quantity: number
          size?: string | null
          options?: Json
          price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          size?: string | null
          options?: Json
          price?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
