import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Use the environment variables that are already available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// For client-side usage
export const createClientComponentClient = () => createClient<Database>(supabaseUrl, supabaseAnonKey)

// For server-side usage (Server Components, Server Actions, API Routes)
export const createServerComponentClient = () =>
  createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  })

// Export a default client for backward compatibility
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
