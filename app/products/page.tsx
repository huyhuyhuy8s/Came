import { getProductsServer } from "@/lib/product-service"
import { ProductCard } from "@/components/product-card"

export default async function ProductsPage() {
  const { products } = await getProductsServer()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Our Products</h1>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">No products found. Please seed the database first.</p>
          <a href="/api/seed" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Seed Database
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              image={product.image_url}
              price={product.price_min}
              category={product.category}
            />
          ))}
        </div>
      )}
    </div>
  )
}
