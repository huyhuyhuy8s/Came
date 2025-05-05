import { getProductById } from "@/lib/product-service"
import { notFound } from "next/navigation"
import Image from "next/image"
import { AddToCartForm } from "@/components/add-to-cart-form"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { product, sizes, options } = await getProductById(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square relative">
          <Image
            src={product.image_url || `/placeholder.svg?height=600&width=600&text=${encodeURIComponent(product.name)}`}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-500 mt-2">{product.description}</p>

          <div className="mt-6">
            <p className="text-xl font-semibold">
              ${product.price_min.toFixed(2)}
              {product.price_min !== product.price_max && ` - $${product.price_max.toFixed(2)}`}
            </p>
          </div>

          <AddToCartForm product={product} sizes={sizes} options={options} />
        </div>
      </div>
    </div>
  )
}
