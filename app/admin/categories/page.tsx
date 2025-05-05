"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { getCategories, type Category } from "@/lib/category-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClientComponentClient } from "@/lib/supabase"

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newCategory, setNewCategory] = useState({ name: "", description: "" })
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    try {
      const { categories: fetchedCategories, error } = await getCategories()

      if (error) {
        setError(error)
      } else {
        setCategories(fetchedCategories)
      }
    } catch (err) {
      setError("Failed to fetch categories")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault()
    setIsAdding(true)

    try {
      const supabase = createClientComponentClient()
      const { data, error } = await supabase
        .from("categories")
        .insert({
          name: newCategory.name,
          description: newCategory.description || null,
        })
        .select()

      if (error) {
        setError(`Failed to add category: ${error.message}`)
      } else {
        setNewCategory({ name: "", description: "" })
        fetchCategories()
      }
    } catch (err) {
      setError("Failed to add category")
      console.error(err)
    } finally {
      setIsAdding(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Categories Admin</h1>
        <div className="flex justify-center items-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Categories Admin</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Category</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                rows={3}
              />
            </div>
            <Button type="submit" disabled={isAdding}>
              {isAdding ? "Adding..." : "Add Category"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4">Existing Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">{category.description || "No description"}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
