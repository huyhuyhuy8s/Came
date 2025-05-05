import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ProductCardProps {
  id: string
  name: string
  description: string | null
  image: string | null
  price: number
  category: string
}

export function ProductCard({ id, name, description, image, price, category }: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square relative">
        <Image
          src={image || `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(name)}`}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-bold">${price.toFixed(2)}</span>
          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{category}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/product/${id}`} className="w-full">
          <Button className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
