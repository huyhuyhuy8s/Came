"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { signIn, signUp, signOut, getUserProfile } from "@/lib/auth-service"
import { createClientComponentClient } from "@/lib/supabase"

// Define user type
export type AppUser = {
  id: string
  email: string
  name: string
  avatar?: string
}

type UserContextType = {
  user: AppUser | null
  users: AppUser[]
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  register: (email: string, name: string, password: string) => Promise<{ success: boolean; error?: string }>
  updateUser: (userData: Partial<AppUser>) => Promise<void>
  isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

// Sample users for fallback when database connection fails
const FALLBACK_USERS: AppUser[] = [
  {
    id: "1",
    email: "user@example.com",
    name: "Demo User",
    avatar: "/placeholder.svg?height=40&width=40&text=D",
  },
  {
    id: "2",
    email: "admin@example.com",
    name: "Admin User",
    avatar: "/placeholder.svg?height=40&width=40&text=A",
  },
]

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [users, setUsers] = useState<AppUser[]>(FALLBACK_USERS) // Initialize with fallback users
  const [isLoading, setIsLoading] = useState(true)
  const [supabaseInitialized, setSupabaseInitialized] = useState(false)
  const [supabase, setSupabase] = useState<any>(null)

  // Initialize Supabase client safely
  useEffect(() => {
    try {
      const client = createClientComponentClient()
      setSupabase(client)
      setSupabaseInitialized(true)
    } catch (error) {
      console.error("Failed to initialize Supabase client:", error)
    }
  }, [])

  // Load user on initial render
  useEffect(() => {
    if (!supabaseInitialized || !supabase) return

    async function loadUser() {
      setIsLoading(true)

      try {
        // Get the current session
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          // Simplified user loading - don't wait for profile
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata?.name || "User",
            avatar: `/placeholder.svg?height=40&width=40&text=${(session.user.user_metadata?.name || "U").charAt(0)}`,
          })

          // Load profile in background
          getUserProfile(session.user.id).then(({ profile }) => {
            if (profile) {
              setUser((prev) => {
                if (!prev) return prev
                return {
                  ...prev,
                  name: profile.name || prev.name,
                  avatar: profile.avatar_url || prev.avatar,
                }
              })
            }
          })
        }
      } catch (error) {
        console.error("Error loading user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()

    // Set up auth state listener
    let subscription: { unsubscribe: () => void } | null = null

    try {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_OUT") {
          setUser(null)
          return
        }

        if (session?.user) {
          // Set basic user info immediately
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata?.name || "User",
            avatar: `/placeholder.svg?height=40&width=40&text=${(session.user.user_metadata?.name || "U").charAt(0)}`,
          })

          // Load profile in background
          getUserProfile(session.user.id).then(({ profile }) => {
            if (profile) {
              setUser((prev) => {
                if (!prev) return prev
                return {
                  ...prev,
                  name: profile.name || prev.name,
                  avatar: profile.avatar_url || prev.avatar,
                }
              })
            }
          })
        } else {
          setUser(null)
        }
      })

      subscription = data.subscription
    } catch (error) {
      console.error("Error setting up auth state listener:", error)
    }

    // Cleanup subscription
    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [supabaseInitialized, supabase])

  // Load users in a separate effect to avoid blocking the initial render
  useEffect(() => {
    if (!supabaseInitialized || !supabase) return

    const fetchUsers = async () => {
      try {
        // First try to fetch from Supabase
        const { data, error } = await supabase.from("users").select("*")

        if (error) {
          console.error("Error fetching users from Supabase:", error)
          // Keep using fallback users
          return
        }

        if (data && Array.isArray(data)) {
          setUsers(
            data.map((user) => ({
              id: user.id,
              email: user.email,
              name: user.name,
              avatar: user.avatar_url || `/placeholder.svg?height=40&width=40&text=${user.name.charAt(0)}`,
            })),
          )
        }
      } catch (error) {
        console.error("Exception fetching users:", error)
        // Keep using fallback users
      }
    }

    fetchUsers()
  }, [supabaseInitialized, supabase])

  const login = async (email: string, password: string) => {
    if (!supabaseInitialized || !supabase) {
      return { success: false, error: "Database connection not available" }
    }

    setIsLoading(true)

    try {
      const { success, error, user: authUser } = await signIn(email, password)

      if (!success) {
        return { success: false, error: error || "Login failed" }
      }

      // Set user immediately for faster UI update
      if (authUser) {
        setUser({
          id: authUser.id,
          email: authUser.email || "",
          name: authUser.user_metadata?.name || "User",
          avatar: `/placeholder.svg?height=40&width=40&text=${(authUser.user_metadata?.name || "U").charAt(0)}`,
        })
      }

      return { success: true }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "An unexpected error occurred" }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, name: string, password: string) => {
    if (!supabaseInitialized || !supabase) {
      return { success: false, error: "Database connection not available" }
    }

    setIsLoading(true)

    try {
      const { success, error, user: authUser } = await signUp(email, password, name)

      if (!success) {
        return { success: false, error: error || "Registration failed" }
      }

      // Set user immediately for faster UI update
      if (authUser) {
        setUser({
          id: authUser.id,
          email: authUser.email || "",
          name: name,
          avatar: `/placeholder.svg?height=40&width=40&text=${name.charAt(0)}`,
        })
      }

      return { success: true }
    } catch (error) {
      console.error("Registration error:", error)
      return { success: false, error: "An unexpected error occurred" }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    if (!supabaseInitialized || !supabase) {
      setUser(null)
      return
    }

    try {
      await signOut()
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
      // Force logout even if the API call fails
      setUser(null)
    }
  }

  const updateUser = async (userData: Partial<AppUser>) => {
    if (!user || !supabaseInitialized || !supabase) return

    try {
      // Update user profile in Supabase
      const { error } = await supabase
        .from("users")
        .update({
          name: userData.name,
          avatar_url: userData.avatar,
        })
        .eq("id", user.id)

      if (error) throw error

      // Update local state
      setUser({
        ...user,
        ...userData,
      })
    } catch (error) {
      console.error("Error updating user:", error)
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        users,
        login,
        logout,
        register,
        updateUser,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
