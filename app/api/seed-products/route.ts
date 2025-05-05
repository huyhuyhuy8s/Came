import { createClient } from "@/lib/supabase-client"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createClient()

    // First, get all categories
    const { data: categories, error: categoriesError } = await supabase.from("categories").select("*")

    if (categoriesError) {
      console.error("Error fetching categories:", categoriesError)
      return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
    }

    // Create a map of category names to IDs
    const categoryMap = categories.reduce((map, category) => {
      map[category.name.toLowerCase()] = category.id
      return map
    }, {})

    // Sample products
    const products = [
      {
        name: "Espresso",
        description: "Strong coffee brewed by forcing hot water under pressure through finely ground coffee beans",
        price_min: 3.99,
        price_max: 3.99,
        image_url: "/placeholder.svg?height=200&width=200&text=Espresso",
        category: "Coffee",
        category_id: categoryMap["coffee"],
      },
      {
        name: "Cappuccino",
        description: "Coffee drink with espresso, hot milk, and steamed milk foam",
        price_min: 4.99,
        price_max: 5.99,
        image_url: "/placeholder.svg?height=200&width=200&text=Cappuccino",
        category: "Coffee",
        category_id: categoryMap["coffee"],
      },
      {
        name: "Latte",
        description: "Coffee drink made with espresso and steamed milk",
        price_min: 4.99,
        price_max: 5.99,
        image_url: "/placeholder.svg?height=200&width=200&text=Latte",
        category: "Coffee",
        category_id: categoryMap["coffee"],
      },
      {
        name: "Green Tea",
        description:
          "Tea made from Camellia sinensis leaves that have not undergone the same withering and oxidation process",
        price_min: 3.49,
        price_max: 4.49,
        image_url: "/placeholder.svg?height=200&width=200&text=Green%20Tea",
        category: "Tea",
        category_id: categoryMap["tea"],
      },
      {
        name: "Croissant",
        description: "Buttery, flaky, viennoiserie pastry named for its historical crescent shape",
        price_min: 2.99,
        price_max: 2.99,
        image_url: "/placeholder.svg?height=200&width=200&text=Croissant",
        category: "Pastry",
        category_id: categoryMap["pastry"],
      },
      {
        name: "Breakfast Sandwich",
        description: "Sandwich with egg, cheese, and choice of bacon or sausage",
        price_min: 5.99,
        price_max: 7.99,
        image_url: "/placeholder.svg?height=200&width=200&text=Breakfast%20Sandwich",
        category: "Breakfast",
        category_id: categoryMap["breakfast"],
      },
    ]

    // Insert products
    const { error: productsError } = await supabase.from("products").upsert(products, { onConflict: "name" })

    if (productsError) {
      console.error("Error inserting products:", productsError)
      return NextResponse.json({ error: "Failed to insert products" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Products seeded successfully" })
  } catch (err) {
    console.error("Exception seeding products:", err)
    return NextResponse.json({ error: "Failed to seed products" }, { status: 500 })
  }
}
