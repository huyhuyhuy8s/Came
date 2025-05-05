"use client"

import { useState } from "react"
import { createClientComponentClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SetupRLSPage() {
  const [status, setStatus] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const setupRLS = async () => {
    setIsLoading(true)
    setStatus("Setting up RLS policies...")

    try {
      const supabase = createClientComponentClient()

      // Enable RLS on users table
      setStatus("Enabling RLS on users table...")
      await supabase.rpc("enable_rls", { table_name: "users" })

      // Create policy for users table - allow authenticated users to read all users
      setStatus("Creating read policy for users table...")
      await supabase.rpc("create_policy", {
        table_name: "users",
        name: "Users can read all users",
        definition: "true",
        check_expression: "",
        action: "SELECT",
      })

      // Create policy for users table - allow users to update their own data
      setStatus("Creating update policy for users table...")
      await supabase.rpc("create_policy", {
        table_name: "users",
        name: "Users can update own data",
        definition: "auth.uid() = id",
        check_expression: "",
        action: "UPDATE",
      })

      // Create policy for users table - allow authenticated users to insert their own data
      setStatus("Creating insert policy for users table...")
      await supabase.rpc("create_policy", {
        table_name: "users",
        name: "Users can insert own data",
        definition: "auth.uid() = id",
        check_expression: "",
        action: "INSERT",
      })

      // Enable RLS on products table
      setStatus("Enabling RLS on products table...")
      await supabase.rpc("enable_rls", { table_name: "products" })

      // Create policy for products table - allow anyone to read products
      setStatus("Creating read policy for products table...")
      await supabase.rpc("create_policy", {
        table_name: "products",
        name: "Anyone can read products",
        definition: "true",
        check_expression: "",
        action: "SELECT",
      })

      setStatus("RLS policies set up successfully!")
    } catch (error) {
      console.error("Error setting up RLS:", error)
      setStatus(`Error setting up RLS: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Setup Row Level Security</CardTitle>
          <CardDescription>This will set up the necessary RLS policies for your Supabase tables.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4">
            Note: You need to have the appropriate permissions to run these commands. If you're not the owner of the
            Supabase project, you'll need to ask them to run these commands.
          </p>
          <div className="bg-muted p-3 rounded-md text-sm">
            <pre className="whitespace-pre-wrap">{status || "Click the button below to set up RLS policies."}</pre>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={setupRLS} disabled={isLoading} className="w-full">
            {isLoading ? "Setting up..." : "Setup RLS Policies"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
