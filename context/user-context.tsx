"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define user type
export type User = {
  id: string
  email: string
  name: string
  avatar?: string
}

// Mock user database - we'll use this to simulate a backend
const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "user@example.com",
    name: "Demo User",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    email: "admin@example.com",
    name: "Admin User",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

type UserContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (email: string, name: string, password: string) => Promise<boolean>
  updateUser: (userData: Partial<User>) => void
  isLoading: boolean
  users: User[] // Expose users for debugging
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])

  // Load user and users from localStorage on initial render
  useEffect(() => {
    // Load saved users
    const savedUsers = localStorage.getItem("users")
    if (savedUsers) {
      try {
        const parsedUsers = JSON.parse(savedUsers)
        setUsers(parsedUsers)
      } catch (error) {
        console.error("Failed to parse users from localStorage", error)
        // Initialize with mock users if parsing fails
        setUsers(MOCK_USERS)
        localStorage.setItem("users", JSON.stringify(MOCK_USERS))
      }
    } else {
      // Initialize with mock users if no saved users
      setUsers(MOCK_USERS)
      localStorage.setItem("users", JSON.stringify(MOCK_USERS))
    }

    // Load current user
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error("Failed to parse user from localStorage", error)
      }
    }
    setIsLoading(false)
  }, [])

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
    } else {
      localStorage.removeItem("user")
    }
  }, [user])

  // Save users to localStorage whenever they change
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem("users", JSON.stringify(users))
    }
  }, [users])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Find user by email (in a real app, you'd verify the password too)
    const foundUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

    if (foundUser) {
      setUser(foundUser)
      return true
    }

    return false
  }

  const register = async (email: string, name: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    const userExists = users.some((u) => u.email.toLowerCase() === email.toLowerCase())
    if (userExists) {
      return false
    }

    // Create new user
    const newUser: User = {
      id: `${users.length + 1}`,
      email,
      name,
      avatar: `/placeholder.svg?height=40&width=40&text=${name.charAt(0)}`,
    }

    // Add to users array
    setUsers((prevUsers) => [...prevUsers, newUser])

    // Log in the new user
    setUser(newUser)

    return true
  }

  const logout = () => {
    setUser(null)
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)

      // Also update the user in the users array
      setUsers((prevUsers) => prevUsers.map((u) => (u.id === user.id ? updatedUser : u)))
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        updateUser,
        isLoading,
        users,
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
