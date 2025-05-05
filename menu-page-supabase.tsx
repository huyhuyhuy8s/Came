"use client";

import { useState, useEffect } from "react"; // Added useEffect
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, Search, Minus, Plus, X, Loader2 } from "lucide-react"; // Added Loader2

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader, // Added DialogHeader
  DialogTitle, // Added DialogTitle
  DialogDescription, // Added DialogDescription
  DialogClose,
} from "@/components/ui/dialog";
// Removed Select imports as AddToCartForm handles it
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { useCart } from "@/context/cart-context";
import { UserMenu } from "@/components/user-menu";
// Assuming getProductById fetches product, sizes, and options
import {
  getProductById,
  getAllProducts,
  ProductWithCategory,
} from "@/lib/product-service";
import { getCategories, Category } from "@/lib/category-service";
import { AddToCartForm } from "@/components/add-to-cart-form"; // Ensure this path is correct

// Keep categories definition or fetch dynamically if needed
const staticCategories = [
  "All",
  "Coffee",
  "Lattes & Seasonal",
  "Pastry",
  "Merchandise",
  "Other Drinks",
];

export default function MenuPageSupabase({ initialProducts = [] }) {
  const router = useRouter();
  // Removed addItem from useCart as AddToCartForm handles it
  const { itemCount } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState<ProductWithCategory | null>(
    null
  ); // Keep basic item for triggering
  const [selectedItemDetails, setSelectedItemDetails] = useState<any | null>(
    null
  ); // State for detailed data
  // Removed quantity, selectedSize, selectedOption states
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] =
    useState<ProductWithCategory[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>([]); // State for fetched categories
  const [isLoadingDetails, setIsLoadingDetails] = useState(false); // Loading state for dialog details
  const [isLoadingProducts, setIsLoadingProducts] = useState(
    initialProducts.length === 0
  ); // Loading state for initial products/categories

  // Fetch initial products and categories
  useEffect(() => {
    async function fetchData() {
      setIsLoadingProducts(true);
      try {
        const [
          { categories: fetchedCategories, error: categoriesError },
          { products: fetchedProducts, error: productsError },
        ] = await Promise.all([getCategories(), getAllProducts()]);

        if (categoriesError) {
          console.error("Error fetching categories:", categoriesError);
          toast({ title: "Error", description: "Failed to load categories." });
        } else {
          setCategories(fetchedCategories || []);
        }

        if (productsError) {
          console.error("Error fetching products:", productsError);
          toast({ title: "Error", description: "Failed to load products." });
          setProducts(initialProducts); // Use initial/fallback if fetch fails
        } else {
          setProducts(fetchedProducts || initialProducts);
        }
      } catch (err) {
        console.error("Exception fetching data:", err);
        toast({ title: "Error", description: "An unexpected error occurred." });
        setProducts(initialProducts); // Use initial/fallback on exception
      } finally {
        setIsLoadingProducts(false);
      }
    }

    // Only fetch if products/categories aren't pre-loaded
    if (initialProducts.length === 0 || categories.length === 0) {
      fetchData();
    }
  }, [initialProducts]); // Rerun if initialProducts change (though unlikely)

  // Determine categories to display
  const displayCategories =
    categories.length > 0
      ? [{ id: "all", name: "All" }, ...categories]
      : [
          { id: "all", name: "All" },
          ...staticCategories
            .slice(1)
            .map((c) => ({ id: c.toLowerCase(), name: c })),
        ]; // Fallback to static if fetch fails

  // Filter items by selected category and search query
  const filteredItems = products.filter((item) => {
    const categoryMatch =
      selectedCategory === "All" ||
      item.category_id === selectedCategory || // Match by ID if categories were fetched
      item.categories?.name.toLowerCase() === selectedCategory.toLowerCase() || // Match by name from relation
      item.category?.toLowerCase() === selectedCategory.toLowerCase(); // Fallback match by string name

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const nameMatch = item.name.toLowerCase().includes(query);
      const descriptionMatch =
        item.description && item.description.toLowerCase().includes(query);
      return categoryMatch && (nameMatch || descriptionMatch);
    }

    return categoryMatch;
  });

  // Handle opening the modal and fetching details
  const openItemModal = async (item: ProductWithCategory) => {
    setIsLoadingDetails(true);
    setSelectedItem(item); // Set the basic item to open the dialog
    setSelectedItemDetails(null); // Clear previous details

    try {
      // Fetch detailed product information including sizes and options
      const { product, sizes, options } = await getProductById(item.id);

      if (product) {
        setSelectedItemDetails({
          ...product,
          sizes: sizes || [],
          options: options || [],
        });
      } else {
        throw new Error("Product details not found.");
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      toast({
        title: "Error",
        description: "Failed to load product details. Please try again.",
        variant: "destructive",
      });
      setSelectedItem(null); // Close dialog on error
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Handle closing the modal
  const closeItemModal = () => {
    setSelectedItem(null);
    setSelectedItemDetails(null);
  };

  // Removed decreaseQuantity, increaseQuantity, getPrice, handleAddToCart
  // AddToCartForm will handle its own state and the add to cart logic via context

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId === "all" ? "All" : categoryId);
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="border-b py-4 sticky top-0 bg-background z-10">
        {" "}
        {/* Make header sticky */}
        <div className="container mx-auto flex items-center justify-between px-4">
          <nav className="hidden md:flex items-center space-x-8">
            {" "}
            {/* Hide nav on small screens */}
            <Link href="/" className="text-sm font-medium">
              Home
            </Link>
            <Link
              href="/menu"
              className="text-sm font-medium text-primary underline"
            >
              {" "}
              {/* Highlight current page */}
              Menu
            </Link>
            <Link href="/about" className="text-sm font-medium">
              About us
            </Link>
          </nav>

          {/* Centered Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
            <Link href="/" className="text-2xl font-bold">
              Came
            </Link>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-2 md:space-x-4 ml-auto">
            {" "}
            {/* Use ml-auto to push right */}
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
                  variant="destructive"
                  className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Search and Category Filter */}
          <div className="mb-8 space-y-4 md:flex md:items-center md:justify-between md:space-y-0">
            <div className="relative w-full md:max-w-xs">
              <Input
                type="search"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>

            {/* Category Tabs */}
            <Tabs
              value={selectedCategory === "All" ? "all" : selectedCategory}
              onValueChange={handleCategorySelect}
              className="w-full overflow-x-auto md:w-auto"
            >
              <TabsList className="flex w-max md:w-auto">
                {displayCategories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="capitalize"
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Product Grid */}
          {isLoadingProducts ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              No products found {searchQuery && `for "${searchQuery}"`}{" "}
              {selectedCategory !== "All" &&
                `in ${
                  categories.find((c) => c.id === selectedCategory)?.name ||
                  selectedCategory
                }`}
              .
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredItems.map((item) => (
                <Dialog
                  key={item.id}
                  onOpenChange={(isOpen) => !isOpen && closeItemModal()}
                >
                  <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-md">
                    <DialogTrigger asChild onClick={() => openItemModal(item)}>
                      <button className="flex flex-col h-full text-left">
                        {" "}
                        {/* Make card clickable */}
                        <div className="aspect-square w-full overflow-hidden relative">
                          <Image
                            src={
                              item.image_url ||
                              `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(
                                item.name
                              )}`
                            }
                            alt={item.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105" // Added group-hover for potential future use
                          />
                        </div>
                        <CardHeader className="pb-2 pt-4">
                          <CardTitle className="text-lg">{item.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow pb-3">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {item.description}
                          </p>
                        </CardContent>
                        <CardFooter className="flex items-center justify-between pt-0 pb-4">
                          <p className="text-base font-semibold">
                            ₫{(item.price_min || 0).toLocaleString()}
                            {item.price_min !== item.price_max &&
                              item.price_max &&
                              ` - ₫${(item.price_max || 0).toLocaleString()}`}
                          </p>
                          {/* Removed View Details button, card is trigger */}
                        </CardFooter>
                      </button>
                    </DialogTrigger>
                  </Card>

                  {/* Dialog Content */}
                  <DialogContent className="sm:max-w-[600px] p-0">
                    {" "}
                    {/* Increased width, remove padding */}
                    {isLoadingDetails ? (
                      <div className="flex justify-center items-center h-96">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : selectedItemDetails ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                        {" "}
                        {/* Two columns */}
                        {/* Left: Image */}
                        <div className="relative aspect-square md:aspect-auto md:h-full overflow-hidden">
                          <Image
                            src={
                              selectedItemDetails.image_url ||
                              `/placeholder.svg?height=600&width=600&text=${encodeURIComponent(
                                selectedItemDetails.name
                              )}`
                            }
                            alt={selectedItemDetails.name}
                            fill
                            className="object-cover"
                          />
                          <DialogClose className="absolute top-2 right-2 bg-background/80 rounded-full p-1 text-foreground hover:bg-background">
                            <X className="h-5 w-5" />
                          </DialogClose>
                        </div>
                        {/* Right: Details and Form */}
                        <div className="p-6 flex flex-col">
                          <DialogHeader className="mb-4">
                            <DialogTitle className="text-2xl">
                              {selectedItemDetails.name}
                            </DialogTitle>
                            <DialogDescription>
                              {selectedItemDetails.description}
                            </DialogDescription>
                          </DialogHeader>

                          {/* AddToCartForm Integration */}
                          <div className="flex-grow overflow-y-auto pr-2">
                            {" "}
                            {/* Allow scrolling for form */}
                            <AddToCartForm
                              product={selectedItemDetails}
                              sizes={selectedItemDetails.sizes || []}
                              options={selectedItemDetails.options || []}
                              // Pass close function to the form if needed
                              onAddToCart={closeItemModal} // Example: Close dialog after adding
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-center items-center h-96 text-muted-foreground">
                        Error loading details.
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black py-8 text-white mt-16">
        {" "}
        {/* Added margin-top */}
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h2 className="text-xl font-medium">Came</h2>
          </div>
          <Separator className="mb-6 bg-gray-800" />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {" "}
            {/* Adjusted grid */}
            <div>
              <h3 className="mb-4 text-sm font-medium">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/" className="hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/menu" className="hover:text-white">
                    Menu
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="hover:text-white">
                    Cart
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-medium">Visit Us</h3>
              <p className="text-sm text-gray-400">
                1813 N Milwaukee Ave Ste 1
              </p>
              <p className="text-sm text-gray-400">Chicago, IL 60647</p>
              <p className="mt-2 text-sm text-gray-400">
                Open daily: 7am - 7pm
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-medium">Contact</h3>
              <p className="text-sm text-gray-400">hello@came.coffee</p>
              <p className="text-sm text-gray-400">(312) 555-1234</p>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-medium">Stay in the Loop</h3>
              <div className="flex max-w-md">
                <Input
                  type="email"
                  placeholder="Email"
                  className="rounded-r-none border-gray-700 bg-transparent text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                  aria-label="Email for newsletter"
                />
                <Button className="rounded-l-none border border-l-0 border-gray-700">
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
          <Separator className="my-6 bg-gray-800" />
          <div className="text-center text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Came Coffee. All rights reserved.
            |
            <Link href="/privacy" className="underline mx-1">
              Privacy Policy
            </Link>{" "}
            |
            <Link href="/terms" className="underline mx-1">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
