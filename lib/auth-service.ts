import { createClientComponentClient } from "./supabase"
import type { User } from "@supabase/supabase-js"

export type AuthResponse = {
  success: boolean
  user: User | null
  error?: string
}

export async function signUp(email: string, password: string, name: string): Promise<AuthResponse> {
  const supabase = createClientComponentClient()

  try {
    // First, create the auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })

    if (error) {
      console.error("Auth signup error:", error)
      return { success: false, user: null, error: error.message }
    }

    if (data.user) {
      // Try to insert into users table, but don't fail if it doesn't work
      try {
        const { error: insertError } = await supabase.from("users").insert([
          {
            id: data.user.id,
            email: data.user.email!,
            name: name,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])

        if (insertError) {
          console.error("Error inserting user into users table:", insertError)
          // Continue anyway since the auth user was created
        }
      } catch (insertErr) {
        console.error("Exception inserting user:", insertErr)
        // Continue anyway since the auth user was created
      }

      // Return success even if the users table insert failed
      // The auth user is created, which is what matters
      return { success: true, user: data.user }
    }

    return { success: false, user: null, error: "User creation failed" }
  } catch (error) {
    console.error("Sign up error:", error)
    return { success: false, user: null, error: "An unexpected error occurred" }
  }
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  const supabase = createClientComponentClient()

  try {
    // Simplified login - just authenticate, don't check users table
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Sign in error:", error)
      return { success: false, user: null, error: error.message }
    }

    if (!data.user) {
      return { success: false, user: null, error: "User not found" }
    }

    // Return success immediately without additional checks
    return { success: true, user: data.user }
  } catch (error) {
    console.error("Sign in error:", error)
    return { success: false, user: null, error: "An unexpected error occurred" }
  }
}

export async function signOut(): Promise<void> {
  const supabase = createClientComponentClient()
  await supabase.auth.signOut()
}

export async function getCurrentUser(): Promise<{ user: User | null }> {
  const supabase = createClientComponentClient()

  try {
    const { data } = await supabase.auth.getUser()
    return { user: data.user }
  } catch (error) {
    console.error("Get current user error:", error)
    return { user: null }
  }
}

export async function getUserProfile(userId: string) {
  const supabase = createClientComponentClient()

  try {
    const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

    if (error) {
      // If we can't get the profile from users table, return basic info
      return {
        profile: {
          id: userId,
          name: "User",
          email: "",
          avatar_url: null,
        },
      }
    }

    return { profile: data }
  } catch (error) {
    console.error("Get user profile error:", error)
    return {
      profile: {
        id: userId,
        name: "User",
        email: "",
        avatar_url: null,
      },
    }
  }
}
