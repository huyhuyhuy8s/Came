"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export default function SeedProductsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  async function handleSeed() {
    setLoading(true)

    try {
      const response = await fetch("/api/seed-products")
      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Products seeded successfully",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to seed products",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Exception seeding products:", err)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Seed Products</CardTitle>
          <CardDescription>
            This will add sample products to your database. Existing products with the same name will be updated.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            This will create sample products for each category in your database. Make sure you have created categories
            first.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSeed} disabled={loading}>
            {loading ? "Seeding..." : "Seed Products"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
