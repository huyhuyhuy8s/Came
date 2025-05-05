"use client";

import { useEffect, useState } from "react";
import {
  getAllProducts,
  type ProductWithCategory,
} from "@/lib/product-service";
import { getCategories, type Category } from "@/lib/category-service";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "@/hooks/use-toast"; // Corrected import path
// Add necessary imports for header/footer
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { UserMenu } from "@/components/user-menu";
import { useCart } from "@/context/cart-context";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
// Import Dialog components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  // DialogFooter, // Optional: if you want a close button in footer
  // DialogClose, // Optional: for a close button
} from "@/components/ui/dialog";
// Import AddToCartForm
import { AddToCartForm } from "@/components/add-to-cart-form"; // Make sure this path is correct

export default function MenuPage({ initialProducts = [] }) {
  const [products, setProducts] =
    useState<ProductWithCategory[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(initialProducts.length === 0);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  // Add hooks needed for header/footer
  const router = useRouter();
  const { itemCount } = useCart();

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch categories
        const { categories: fetchedCategories, error: categoriesError } =
          await getCategories();

        if (categoriesError) {
          console.error("Error fetching categories:", categoriesError);
          toast({
            title: "Error",
            description: "Failed to load categories. Using fallback data.",
          });
        } else {
          setCategories(fetchedCategories);
        }

        // Only fetch products if we don't have initialProducts
        if (initialProducts.length === 0) {
          const { products: fetchedProducts, error: productsError } =
            await getAllProducts();

          if (productsError) {
            console.error("Error fetching products:", productsError);
            toast({
              title: "Error",
              description: "Failed to load products. Using fallback data.",
            });
          } else if (fetchedProducts && fetchedProducts.length > 0) {
            setProducts(fetchedProducts);
          } else {
            // Use fallback products if none were found
            const fallbackProducts = [
              {
                id: "1",
                name: "Espresso",
                description:
                  "Strong coffee brewed by forcing hot water under pressure through finely ground coffee beans",
                image_url:
                  "/placeholder.svg?height=200&width=200&text=Espresso",
                category: "Coffee",
                price_min: 3.99,
                price_max: 4.99,
              },
              {
                id: "2",
                name: "Cappuccino",
                description:
                  "Coffee drink with espresso, hot milk, and steamed milk foam",
                image_url:
                  "/placeholder.svg?height=200&width=200&text=Cappuccino",
                category: "Coffee",
                price_min: 4.99,
                price_max: 5.99,
              },
              {
                id: "3",
                name: "Latte",
                description: "Coffee drink made with espresso and steamed milk",
                image_url: "/placeholder.svg?height=200&width=200&text=Latte",
                category: "Coffee",
                price_min: 4.99,
                price_max: 5.99,
              },
            ];
            setProducts(fallbackProducts);
          }
        }
      } catch (err) {
        console.error("Exception fetching data:", err);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Using fallback data.",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [initialProducts]);

  // If we have no categories yet, extract unique categories from products
  const displayCategories =
    categories.length > 0
      ? categories
      : Array.from(new Set(products.map((p) => p.category)))
          .filter(Boolean)
          .map((name) => ({ id: name, name }));

  const filteredProducts = selectedCategoryId
    ? products.filter(
        (product) =>
          product.category_id === selectedCategoryId ||
          product.categories?.id === selectedCategoryId ||
          selectedCategoryId === product.category
      )
    : products;

  if (loading) {
    // Consider adding header/footer here too for consistent loading state
    return (
      <div className="flex min-h-screen flex-col">
        {/* Header */}
        <header className="border-b py-4">
          <div className="container mx-auto flex items-center justify-between px-4">
            <nav className="flex items-center space-x-8">
              <Link href="/" className="text-sm font-medium">
                Home
              </Link>
              <Link href="/menu" className="text-sm font-medium">
                Menu
              </Link>
              <Link href="/about" className="text-sm font-medium">
                About us
              </Link>
            </nav>
            <div className="absolute left-1/2 -translate-x-1/2 transform">
              <Link href="/" className="text-2xl font-bold">
                Came
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <UserMenu />
              <Button
                variant="ghost"
                size="icon"
                aria-label="Shopping cart"
                className="relative"
                onClick={() => router.push("/cart")}
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge
                    className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                    variant="destructive"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </header>
        {/* Loading Content */}
        <main className="flex-1">
          <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Our Menu</h1>
            <div className="flex justify-center items-center h-64">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          </div>
        </main>
        {/* Footer */}
        <footer className="bg-black py-8 text-white">
          <div className="container mx-auto px-4">
            <div className="mb-6">
              <h2 className="text-xl font-medium">Came</h2>
            </div>
            <Separator className="mb-6 bg-gray-800" />
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-sm font-medium">Stay in the Loop</h3>
                <div className="flex max-w-md">
                  <Input
                    type="email"
                    placeholder="Email"
                    className="rounded-r-none border-gray-700 bg-transparent text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <Button className="rounded-l-none border border-l-0 border-gray-700">
                    Sign Up
                  </Button>
                </div>
              </div>
            </div>
            <p className="mt-8 text-xs text-gray-500">
              This form is protected by reCAPTCHA and the Google{" "}
              <Link href="/privacy" className="underline">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link href="/terms" className="underline">
                Terms of Service
              </Link>{" "}
              apply.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    // Wrap existing content with the flex container and add header/footer
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b py-4">
        <div className="container mx-auto flex items-center justify-between px-4">
          <nav className="flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium">
              Home
            </Link>
            <Link href="/menu" className="text-sm font-medium">
              Menu
            </Link>
            <Link href="/about" className="text-sm font-medium">
              About us
            </Link>
          </nav>

          <div className="absolute left-1/2 -translate-x-1/2 transform">
            <Link href="/" className="text-2xl font-bold">
              Came
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <UserMenu />
            <Button
              variant="ghost"
              size="icon"
              aria-label="Shopping cart"
              className="relative"
              onClick={() => router.push("/cart")}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                  variant="destructive"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Original Menu Page Content */}
      <main className="flex-1">
        <div className="container mx-auto py-10">
          <h1 className="text-3xl font-bold mb-6">Our Menu</h1>

          <div className="mb-6 flex flex-wrap gap-2">
            <Button
              variant={selectedCategoryId === null ? "default" : "outline"}
              onClick={() => setSelectedCategoryId(null)}
              className="capitalize"
            >
              All
            </Button>
            {displayCategories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategoryId === category.id ? "default" : "outline"
                }
                onClick={() => setSelectedCategoryId(category.id)}
                className="capitalize"
              >
                {category.name}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Dialog key={product.id}>
                <Card className="overflow-hidden flex flex-col">
                  {/* Keep CardHeader and CardContent as before */}
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={
                        product.image_url ||
                        `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(
                          product.name
                        )}`
                      }
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    {" "}
                    {/* Use flex-grow */}
                    <p className="text-gray-500">{product.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-lg font-bold">
                        ₫{(product.price_min || 0).toFixed(2)}
                        {product.price_min !== product.price_max &&
                          product.price_max && // Add check for price_max existence
                          ` - ₫${(product.price_max || 0).toFixed(2)}`}
                      </p>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                        {product.categories?.name || product.category}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {/* Use DialogTrigger around the Button */}
                    <DialogTrigger asChild>
                      <Button className="w-full">View Details</Button>
                    </DialogTrigger>
                  </CardFooter>
                </Card>

                {/* Define the Dialog Content with the new layout */}
                <DialogContent className="sm:max-w-[425px] md:max-w-[550px]">
                  {" "}
                  {/* Adjusted max width */}
                  {/* Image */}
                  <div className="aspect-square w-full overflow-hidden rounded-lg mb-4">
                    {" "}
                    {/* Changed aspect ratio */}
                    <img
                      src={
                        product.image_url ||
                        `/placeholder.svg?height=400&width=400&text=${encodeURIComponent(
                          product.name
                        )}` // Larger placeholder
                      }
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Text Content Area */}
                  <div>
                    <DialogHeader className="mb-2">
                      {" "}
                      {/* Reduced margin */}
                      <DialogTitle className="text-2xl">
                        {product.name}
                      </DialogTitle>{" "}
                      {/* Larger title */}
                    </DialogHeader>

                    {/* Price */}
                    <p className="text-xl font-semibold mb-2">
                      {" "}
                      {/* Adjusted style */}$ ₫
                      {(product.price_min || 0).toFixed(2)}
                      {product.price_min !== product.price_max &&
                        product.price_max &&
                        ` - ₫${(product.price_max || 0).toFixed(2)}`}
                    </p>

                    {/* Description */}
                    <DialogDescription className="mb-4">
                      {" "}
                      {/* Added margin */}
                      {product.description}
                    </DialogDescription>

                    {/* AddToCartForm Integration */}
                    {/*
                      NOTE: This assumes 'product' might have 'sizes' and 'options'.
                      You might need to fetch detailed product data separately
                      when the dialog opens to get the actual sizes/options.
                    */}
                    <AddToCartForm
                      product={product}
                      // Provide sizes and options - use placeholders if not available on the product object
                      sizes={(product as any).sizes || []} // Cast or adjust type if needed
                      options={(product as any).options || []} // Cast or adjust type if needed
                    />
                  </div>
                  {/* Removed Footer with Close button for now */}
                </DialogContent>
              </Dialog> // End Dialog wrapper
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black py-8 text-white">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h2 className="text-xl font-medium">Came</h2>
          </div>
          <Separator className="mb-6 bg-gray-800" />
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-sm font-medium">Stay in the Loop</h3>
              <div className="flex max-w-md">
                <Input
                  type="email"
                  placeholder="Email"
                  className="rounded-r-none border-gray-700 bg-transparent text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button className="rounded-l-none border border-l-0 border-gray-700">
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
          <p className="mt-8 text-xs text-gray-500">
            This form is protected by reCAPTCHA and the Google{" "}
            <Link href="/privacy" className="underline">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/terms" className="underline">
              Terms of Service
            </Link>{" "}
            apply.
          </p>
        </div>
      </footer>
    </div>
  );
}
