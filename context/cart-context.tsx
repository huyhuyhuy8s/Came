"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useUser } from "./user-context"
import { createClientComponentClient } from "@/lib/supabase"
import {
  getOrCreateCart,
  getCartItems,
  addToCart as addToCartService,
  updateCartItemQuantity,
  removeCartItem,
  clearCart as clearCartService,
} from "@/lib/cart-service"

export type CartItem = {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  size: string
  options: string[]
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: CartItem) => Promise<void>
  removeItem: (id: string) => Promise<void>
  updateQuantity: (id: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  itemCount: number
  subtotal: number
  isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useUser()
  const [items, setItems] = useState<CartItem[]>([])
  const [itemCount, setItemCount] = useState(0)
  const [subtotal, setSubtotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [cartId, setCartId] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  // Load cart when user changes
  useEffect(() => {
    async function loadCart() {
      if (!user) {
        // Not logged in, use localStorage
        loadFromLocalStorage()
        return
      }

      setIsLoading(true)

      try {
        // Get or create cart
        const { cart } = await getOrCreateCart(user.id)

        if (cart) {
          setCartId(cart.id)

          // Load cart items
          const { items: cartItems } = await getCartItems(cart.id)

          if (cartItems && cartItems.length > 0) {
            // Format items for the frontend
            const formattedItems = cartItems.map((item) => ({
              id: item.id,
              name: item.products.name,
              price: item.price,
              image: item.products.image_url || "/placeholder.svg?height=300&width=300",
              quantity: item.quantity,
              size: item.size || "",
              options: item.options || [],
            }))

            setItems(formattedItems)
          } else {
            // Check if we have items in localStorage to migrate
            const localItems = getLocalStorageCart()
            if (localItems.length > 0) {
              // Add local items to the database cart
              for (const item of localItems) {
                await addToCartService(
                  cart.id,
                  item.id.split("-")[0], // Assuming id format is "productId-size-options"
                  item.quantity,
                  item.options,
                )
              }

              // Reload the cart items
              const { items: updatedItems } = await getCartItems(cart.id)
              if (updatedItems) {
                const formattedItems = updatedItems.map((item) => ({
                  id: item.id,
                  name: item.products.name,
                  price: item.price,
                  image: item.products.image_url || "/placeholder.svg?height=300&width=300",
                  quantity: item.quantity,
                  size: item.size || "",
                  options: item.options || [],
                }))

                setItems(formattedItems)
              }

              // Clear localStorage cart
              localStorage.removeItem("cart")
            }
          }
        }
      } catch (error) {
        console.error("Error loading cart from Supabase:", error)
        // Fall back to localStorage
        loadFromLocalStorage()
      } finally {
        setIsLoading(false)
      }
    }

    function loadFromLocalStorage() {
      const localItems = getLocalStorageCart()
      setItems(localItems)
      setIsLoading(false)
    }

    function getLocalStorageCart(): CartItem[] {
      if (typeof window === "undefined") return []

      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        try {
          return JSON.parse(savedCart)
        } catch (error) {
          console.error("Failed to parse cart from localStorage", error)
          return []
        }
      }
      return []
    }

    loadCart()
  }, [user])

  // Update item count and subtotal whenever items change
  useEffect(() => {
    const count = items.reduce((total, item) => total + item.quantity, 0)
    setItemCount(count)

    const total = items.reduce((total, item) => total + item.price * item.quantity, 0)
    setSubtotal(total)

    // Save to localStorage as fallback
    if (typeof window !== "undefined" && !user) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items, user])

  const addItem = async (newItem: CartItem) => {
    setIsLoading(true)

    try {
      if (user && cartId) {
        // Add to Supabase
        await addToCartService(
          cartId,
          newItem.id.split("-")[0], // Extract product ID
          newItem.quantity,
          newItem.options,
        )

        // Reload cart items
        const { items: cartItems } = await getCartItems(cartId)

        if (cartItems) {
          const formattedItems = cartItems.map((item) => ({
            id: item.id,
            name: item.products.name,
            price: item.price,
            image: item.products.image_url || "/placeholder.svg?height=300&width=300",
            quantity: item.quantity,
            size: item.size || "",
            options: item.options || [],
          }))

          setItems(formattedItems)
        }
      } else {
        // Add to local state
        setItems((prevItems) => {
          // Check if item already exists in cart
          const existingItemIndex = prevItems.findIndex(
            (item) =>
              item.id === newItem.id &&
              item.size === newItem.size &&
              JSON.stringify(item.options) === JSON.stringify(item.options),
          )

          if (existingItemIndex >= 0) {
            // Update quantity if item exists
            const updatedItems = [...prevItems]
            updatedItems[existingItemIndex].quantity += newItem.quantity
            return updatedItems
          } else {
            // Add new item if it doesn't exist
            return [...prevItems, newItem]
          }
        })
      }
    } catch (error) {
      console.error("Error adding item to cart:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const removeItem = async (id: string) => {
    setIsLoading(true)

    try {
      if (user && cartId) {
        // Remove from Supabase
        await removeCartItem(id)
      }

      // Remove from local state
      setItems((prevItems) => prevItems.filter((item) => item.id !== id))
    } catch (error) {
      console.error("Error removing item from cart:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (id: string, quantity: number) => {
    setIsLoading(true)

    try {
      if (quantity <= 0) {
        await removeItem(id)
        return
      }

      if (user && cartId) {
        // Update in Supabase
        await updateCartItemQuantity(id, quantity)
      }

      // Update local state
      setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
    } catch (error) {
      console.error("Error updating quantity:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const clearCart = async () => {
    setIsLoading(true)

    try {
      if (user && cartId) {
        // Clear in Supabase
        await clearCartService(cartId)
      }

      // Clear local state
      setItems([])

      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("cart")
      }
    } catch (error) {
      console.error("Error clearing cart:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
