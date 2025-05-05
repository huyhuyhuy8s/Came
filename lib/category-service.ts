import { createClientComponentClient, createServerComponentClient } from "./supabase"

export type Category = {
  id: string
  name: string
  description: string | null
  created_at?: string
  updated_at?: string
}

export async function getCategories() {
  try {
    const supabase = createClientComponentClient()

    const { data, error } = await supabase.from("categories").select("*").order("name")

    if (error) {
      console.error("Error fetching categories:", error)
      return { categories: [], error: error.message }
    }

    return { categories: data as Category[], error: null }
  } catch (err) {
    console.error("Exception fetching categories:", err)
    return { categories: [], error: "Failed to fetch categories" }
  }
}

export async function getCategoriesServer() {
  try {
    const supabase = createServerComponentClient()

    const { data, error } = await supabase.from("categories").select("*").order("name")

    if (error) {
      console.error("Error fetching categories:", error)
      return { categories: [], error: error.message }
    }

    return { categories: data as Category[], error: null }
  } catch (err) {
    console.error("Exception fetching categories:", err)
    return { categories: [], error: "Failed to fetch categories" }
  }
}

export async function getCategoryById(id: string) {
  try {
    const supabase = createClientComponentClient()

    const { data, error } = await supabase.from("categories").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching category:", error)
      return { category: null, error: error.message }
    }

    return { category: data as Category, error: null }
  } catch (err) {
    console.error("Exception fetching category:", err)
    return { category: null, error: "Failed to fetch category" }
  }
}

export async function createCategory(category: Omit<Category, "id" | "created_at" | "updated_at">) {
  try {
    const supabase = createClientComponentClient()

    const { data, error } = await supabase.from("categories").insert(category).select().single()

    if (error) {
      console.error("Error creating category:", error)
      return { category: null, error: error.message }
    }

    return { category: data as Category, error: null }
  } catch (err) {
    console.error("Exception creating category:", err)
    return { category: null, error: "Failed to create category" }
  }
}

export async function updateCategory(
  id: string,
  category: Partial<Omit<Category, "id" | "created_at" | "updated_at">>,
) {
  try {
    const supabase = createClientComponentClient()

    const { data, error } = await supabase.from("categories").update(category).eq("id", id).select().single()

    if (error) {
      console.error("Error updating category:", error)
      return { category: null, error: error.message }
    }

    return { category: data as Category, error: null }
  } catch (err) {
    console.error("Exception updating category:", err)
    return { category: null, error: "Failed to update category" }
  }
}

export async function deleteCategory(id: string) {
  try {
    const supabase = createClientComponentClient()

    const { error } = await supabase.from("categories").delete().eq("id", id)

    if (error) {
      console.error("Error deleting category:", error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (err) {
    console.error("Exception deleting category:", err)
    return { success: false, error: "Failed to delete category" }
  }
}
