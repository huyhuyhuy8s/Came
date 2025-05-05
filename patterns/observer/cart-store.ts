import { Subject } from "./subject"
import type { CartItem } from "@/context/cart-context"

export interface CartState {
  items: CartItem[]
  itemCount: number
  subtotal: number
}

export class CartStore extends Subject<CartState> {
  constructor() {
    super({
      items: [],
      itemCount: 0,
      subtotal: 0,
    })

    // Load from localStorage if available
    this.loadFromStorage()
  }

  private loadFromStorage(): void {
    if (typeof window === "undefined") return

    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart) as CartItem[]
        const itemCount = items.reduce((total, item) => total + item.quantity, 0)
        const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)

        this.setState({
          items,
          itemCount,
          subtotal,
        })
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error)
      }
    }
  }

  private saveToStorage(): void {
    if (typeof window === "undefined") return

    localStorage.setItem("cart", JSON.stringify(this.getState().items))
  }

  public addItem(newItem: CartItem): void {
    const currentState = this.getState()
    const existingItemIndex = currentState.items.findIndex(
      (item) =>
        item.id === newItem.id &&
        item.size === newItem.size &&
        JSON.stringify(item.options) === JSON.stringify(newItem.options),
    )

    let updatedItems: CartItem[]

    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      updatedItems = [...currentState.items]
      updatedItems[existingItemIndex].quantity += newItem.quantity
    } else {
      // Add new item if it doesn't exist
      updatedItems = [...currentState.items, newItem]
    }

    const itemCount = updatedItems.reduce((total, item) => total + item.quantity, 0)
    const subtotal = updatedItems.reduce((total, item) => total + item.price * item.quantity, 0)

    this.setState({
      items: updatedItems,
      itemCount,
      subtotal,
    })

    this.saveToStorage()
  }

  public removeItem(id: string): void {
    const currentState = this.getState()
    const updatedItems = currentState.items.filter((item) => item.id !== id)

    const itemCount = updatedItems.reduce((total, item) => total + item.quantity, 0)
    const subtotal = updatedItems.reduce((total, item) => total + item.price * item.quantity, 0)

    this.setState({
      items: updatedItems,
      itemCount,
      subtotal,
    })

    this.saveToStorage()
  }

  public updateQuantity(id: string, quantity: number): void {
    const currentState = this.getState()
    const updatedItems = currentState.items.map((item) => (item.id === id ? { ...item, quantity } : item))

    const itemCount = updatedItems.reduce((total, item) => total + item.quantity, 0)
    const subtotal = updatedItems.reduce((total, item) => total + item.price * item.quantity, 0)

    this.setState({
      items: updatedItems,
      itemCount,
      subtotal,
    })

    this.saveToStorage()
  }

  public clearCart(): void {
    this.setState({
      items: [],
      itemCount: 0,
      subtotal: 0,
    })

    this.saveToStorage()
  }
}

// Create a singleton instance
export const cartStore = new CartStore()
