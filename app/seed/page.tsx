"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SeedPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; message?: string } | null>(null)

  const handleSeedProducts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/seed-products")
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Error seeding products:", error)
      setResult({ success: false, message: "An error occurred while seeding the database" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Seed Database</CardTitle>
          <CardDescription>Use this page to seed your Supabase database with sample products</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">This will add sample coffee products, sizes, and options to your database.</p>
          {result && (
            <div className={`p-4 rounded-md ${result.success ? "bg-green-100" : "bg-red-100"}`}>{result.message}</div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleSeedProducts} disabled={isLoading}>
            {isLoading ? "Seeding..." : "Seed Products"}
          </Button>
          <Link href="/menu">
            <Button variant="outline">Go to Menu</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
