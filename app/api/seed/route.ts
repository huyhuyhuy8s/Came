import { createServerComponentClient } from "@/lib/supabase"
import { productSeedData } from "@/lib/seed-data"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createServerComponentClient()

    // Insert products
    for (const product of productSeedData) {
      // Check if product already exists
      const { data: existingProduct } = await supabase.from("products").select("id").eq("name", product.name).single()

      if (existingProduct) {
        console.log(`Product ${product.name} already exists, skipping...`)
        continue
      }

      // Insert product
      const { data: newProduct, error: productError } = await supabase
        .from("products")
        .insert({
          name: product.name,
          description: product.description,
          image_url: product.image_url,
          category: product.category,
          price_min: product.price_min,
          price_max: product.price_max,
        })
        .select()
        .single()

      if (productError) {
        console.error(`Error inserting product ${product.name}:`, productError)
        continue
      }

      // Insert sizes
      for (const size of product.sizes) {
        const { error: sizeError } = await supabase.from("product_sizes").insert({
          product_id: newProduct.id,
          value: size.value,
          label: size.label,
          price: size.price,
        })

        if (sizeError) {
          console.error(`Error inserting size for ${product.name}:`, sizeError)
        }
      }

      // Insert options
      for (const option of product.options) {
        const { error: optionError } = await supabase.from("product_options").insert({
          product_id: newProduct.id,
          value: option.value,
          label: option.label,
          price_adjustment: option.price_adjustment,
        })

        if (optionError) {
          console.error(`Error inserting option for ${product.name}:`, optionError)
        }
      }

      console.log(`Successfully added product: ${product.name}`)
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
    })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error seeding database",
      },
      { status: 500 },
    )
  }
}
