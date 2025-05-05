import { createClientComponentClient } from "./supabase"
import { getCartItems } from "./cart-service"

export async function createOrder(
  userId: string,
  cartId: string,
  deliveryOption: string,
  deliveryTime?: string,
  deliveryAddress?: string,
  tip = 0,
) {
  const supabase = createClientComponentClient()

  try {
    // Get cart items
    const { items } = await getCartItems(cartId)

    if (!items || items.length === 0) {
      return { success: false, error: "Cart is empty" }
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const tax = subtotal * 0.0825 // 8.25% tax rate
    const deliveryFee = deliveryOption === "delivery" ? 3.99 : 0
    const total = subtotal + tax + deliveryFee + tip

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        status: "pending",
        subtotal,
        tax,
        tip,
        delivery_fee: deliveryFee,
        total,
        delivery_option: deliveryOption,
        delivery_time: deliveryTime,
        delivery_address: deliveryAddress,
      })
      .select()
      .single()

    if (orderError || !order) {
      throw orderError || new Error("Failed to create order")
    }

    // Create order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.products.name,
      quantity: item.quantity,
      size: item.size,
      options: item.options,
      price: item.price,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      throw itemsError
    }

    // Clear cart
    await supabase.from("cart_items").delete().eq("cart_id", cartId)

    return { success: true, order }
  } catch (error) {
    console.error("Create order error:", error)
    return { success: false, error: "Failed to create order" }
  }
}

export async function getUserOrders(userId: string) {
  const supabase = createClientComponentClient()

  try {
    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return { orders: orders || [] }
  } catch (error) {
    console.error("Get user orders error:", error)
    return { orders: [] }
  }
}

export async function getOrderDetails(orderId: string, userId: string) {
  const supabase = createClientComponentClient()

  try {
    // Get order
    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("user_id", userId)
      .single()

    if (error || !order) {
      throw error || new Error("Order not found")
    }

    // Get order items
    const { data: items, error: itemsError } = await supabase.from("order_items").select("*").eq("order_id", orderId)

    if (itemsError) {
      throw itemsError
    }

    return { order, items: items || [] }
  } catch (error) {
    console.error("Get order details error:", error)
    return { order: null, items: [] }
  }
}
