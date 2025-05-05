import { createClientComponentClient } from "./supabase"

export async function getOrCreateCart(userId: string) {
  const supabase = createClientComponentClient()

  try {
    // Check if user already has a cart
    const { data: existingCart, error } = await supabase.from("carts").select("*").eq("user_id", userId).single()

    if (existingCart) {
      return { cart: existingCart }
    }

    // Before creating a cart, ensure the user exists in the users table
    const { data: userExists } = await supabase.from("users").select("id").eq("id", userId).single()

    if (!userExists) {
      // Create a user record if it doesn't exist
      const { error: userInsertError } = await supabase.from("users").insert({
        id: userId,
        email: "user@example.com", // This will be updated by the auth listener
        name: "User",
      })

      if (userInsertError) {
        console.error("Error creating user record:", userInsertError)
        // Continue anyway, the cart creation might still work if RLS allows it
      }
    }

    // Create a new cart
    const { data: newCart, error: createError } = await supabase
      .from("carts")
      .insert({ user_id: userId })
      .select()
      .single()

    if (createError) {
      // If we still can't create the cart, try a different approach
      console.error("Error creating cart:", createError)

      // Return a temporary cart object
      return {
        cart: {
          id: `temp_${userId}`,
          user_id: userId,
          created_at: new Date().toISOString(),
        },
        isTemporary: true,
      }
    }

    return { cart: newCart }
  } catch (error) {
    console.error("Get or create cart error:", error)

    // Return a temporary cart object
    return {
      cart: {
        id: `temp_${userId}`,
        user_id: userId,
        created_at: new Date().toISOString(),
      },
      isTemporary: true,
    }
  }
}

export async function getCartItems(cartId: string) {
  // Handle temporary cart IDs
  if (cartId.startsWith("temp_")) {
    return { items: [] }
  }

  const supabase = createClientComponentClient()

  try {
    const { data, error } = await supabase
      .from("cart_items")
      .select(`
        *,
        products:product_id (*)
      `)
      .eq("cart_id", cartId)

    if (error) {
      throw error
    }

    return { items: data }
  } catch (error) {
    console.error("Get cart items error:", error)
    return { items: [] }
  }
}

export async function addToCart(cartId: string, productId: string, quantity: number, options: any[] = []) {
  // Handle temporary cart IDs
  if (cartId.startsWith("temp_")) {
    console.warn("Cannot add items to temporary cart")
    return { success: false, error: "Cannot add items to temporary cart" }
  }

  const supabase = createClientComponentClient()

  try {
    // Get product details to calculate price
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single()

    if (productError || !product) {
      throw productError || new Error("Product not found")
    }

    // Check if item already exists in cart
    const { data: existingItems, error: checkError } = await supabase
      .from("cart_items")
      .select("*")
      .eq("cart_id", cartId)
      .eq("product_id", productId)

    if (checkError) {
      throw checkError
    }

    if (existingItems && existingItems.length > 0) {
      // Update quantity if item exists
      const existingItem = existingItems[0]
      const newQuantity = existingItem.quantity + quantity

      const { error: updateError } = await supabase
        .from("cart_items")
        .update({ quantity: newQuantity })
        .eq("id", existingItem.id)

      if (updateError) {
        throw updateError
      }
    } else {
      // Add new item
      const { error: insertError } = await supabase.from("cart_items").insert({
        cart_id: cartId,
        product_id: productId,
        quantity,
        price: product.price_min, // Use base price for now
        options,
      })

      if (insertError) {
        throw insertError
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Add to cart error:", error)
    return { success: false }
  }
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  const supabase = createClientComponentClient()

  try {
    const { error } = await supabase.from("cart_items").update({ quantity }).eq("id", cartItemId)

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error("Update cart item quantity error:", error)
    return { success: false }
  }
}

export async function removeCartItem(cartItemId: string) {
  const supabase = createClientComponentClient()

  try {
    const { error } = await supabase.from("cart_items").delete().eq("id", cartItemId)

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error("Remove cart item error:", error)
    return { success: false }
  }
}

export async function clearCart(cartId: string) {
  // Handle temporary cart IDs
  if (cartId.startsWith("temp_")) {
    return { success: true }
  }

  const supabase = createClientComponentClient()

  try {
    const { error } = await supabase.from("cart_items").delete().eq("cart_id", cartId)

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error("Clear cart error:", error)
    return { success: false }
  }
}
