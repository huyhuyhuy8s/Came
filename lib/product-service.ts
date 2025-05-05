import { createClientComponentClient, createServerComponentClient } from "./supabase"
import type { Category } from "./category-service"

export type Product = {
  id: string
  name: string
  description: string
  price_min: number
  price_max: number
  image_url?: string
  category?: string
  category_id?: string
  created_at?: string
  updated_at?: string
}

export type ProductWithCategory = Product & {
  categories?: Category
}

export async function getAllProducts() {
  try {
    const supabase = createClientComponentClient()

    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories (*)
      `)
      .order("name")

    if (error) {
      console.error("Error fetching products:", error)
      return { products: [], error: error.message }
    }

    return { products: data as ProductWithCategory[], error: null }
  } catch (err) {
    console.error("Exception fetching products:", err)
    return { products: [], error: "Failed to fetch products" }
  }
}

export async function getProductsServer() {
  try {
    const supabase = createServerComponentClient()

    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories (*)
      `)
      .order("name")

    if (error) {
      console.error("Error fetching products:", error)
      return { products: [], error: error.message }
    }

    return { products: data as ProductWithCategory[], error: null }
  } catch (err) {
    console.error("Exception fetching products:", err)
    return { products: [], error: "Failed to fetch products" }
  }
}

export async function getProductById(id: string) {
  try {
    const supabase = createClientComponentClient()

    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories (*)
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching product:", error)
      return { product: null, error: error.message }
    }

    return { product: data as ProductWithCategory, error: null }
  } catch (err) {
    console.error("Exception fetching product:", err)
    return { product: null, error: "Failed to fetch product" }
  }
}

export async function getProductsByCategory(categoryId: string) {
  try {
    const supabase = createClientComponentClient()

    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories (*)
      `)
      .eq("category_id", categoryId)
      .order("name")

    if (error) {
      console.error("Error fetching products by category:", error)
      return { products: [], error: error.message }
    }

    return { products: data as ProductWithCategory[], error: null }
  } catch (err) {
    console.error("Exception fetching products by category:", err)
    return { products: [], error: "Failed to fetch products by category" }
  }
}

export async function createProduct(product: Omit<Product, "id" | "created_at" | "updated_at">) {
  try {
    const supabase = createClientComponentClient()

    const { data, error } = await supabase.from("products").insert(product).select().single()

    if (error) {
      console.error("Error creating product:", error)
      return { product: null, error: error.message }
    }

    return { product: data as Product, error: null }
  } catch (err) {
    console.error("Exception creating product:", err)
    return { product: null, error: "Failed to create product" }
  }
}

export async function updateProduct(id: string, product: Partial<Omit<Product, "id" | "created_at" | "updated_at">>) {
  try {
    const supabase = createClientComponentClient()

    const { data, error } = await supabase.from("products").update(product).eq("id", id).select().single()

    if (error) {
      console.error("Error updating product:", error)
      return { product: null, error: error.message }
    }

    return { product: data as Product, error: null }
  } catch (err) {
    console.error("Exception updating product:", err)
    return { product: null, error: "Failed to update product" }
  }
}

export async function deleteProduct(id: string) {
  try {
    const supabase = createClientComponentClient()

    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) {
      console.error("Error deleting product:", error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (err) {
    console.error("Exception deleting product:", err)
    return { success: false, error: "Failed to delete product" }
  }
}
