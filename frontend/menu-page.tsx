"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, Search, Minus, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/use-toast";
import { useCart } from "@/context/cart-context";
import { UserMenu } from "@/components/user-menu";

// Menu item type definition
type MenuItem = {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  priceMin: number;
  priceMax: number;
  options?: { value: string; label: string; price?: number }[];
  sizes?: { value: string; label: string; price: number }[];
};

// Sample menu data
const menuItems: MenuItem[] = [
  {
    id: "drip-coffee-1",
    name: "Drip Coffee",
    description: "Batch brewed coffee",
    image: "/placeholder.svg?height=300&width=300",
    category: "Coffee",
    priceMin: 3.5,
    priceMax: 4.5,
    sizes: [
      { value: "small", label: "Small (12oz)", price: 3.5 },
      { value: "medium", label: "Medium (16oz)", price: 4.0 },
      { value: "large", label: "Large (20oz)", price: 4.5 },
    ],
    options: [
      { value: "room", label: "Room For Cream" },
      { value: "no-room", label: "No Room" },
    ],
  },
  {
    id: "latte-1",
    name: "Latte",
    description: "Espresso with steamed milk",
    image: "/placeholder.svg?height=300&width=300",
    category: "Lattes & Seasonal",
    priceMin: 4.5,
    priceMax: 5.5,
    sizes: [
      { value: "small", label: "Small (12oz)", price: 4.5 },
      { value: "medium", label: "Medium (16oz)", price: 5.0 },
      { value: "large", label: "Large (20oz)", price: 5.5 },
    ],
    options: [
      { value: "oat-milk", label: "Oat Milk (+$0.75)" },
      { value: "almond-milk", label: "Almond Milk (+$0.75)" },
      { value: "whole-milk", label: "Whole Milk" },
    ],
  },
  {
    id: "cappuccino-1",
    name: "Cappuccino",
    description: "Espresso with equal parts steamed milk and foam",
    image: "/placeholder.svg?height=300&width=300",
    category: "Lattes & Seasonal",
    priceMin: 4.5,
    priceMax: 5.5,
    sizes: [
      { value: "small", label: "Small (12oz)", price: 4.5 },
      { value: "medium", label: "Medium (16oz)", price: 5.0 },
      { value: "large", label: "Large (20oz)", price: 5.5 },
    ],
    options: [
      { value: "oat-milk", label: "Oat Milk (+$0.75)" },
      { value: "almond-milk", label: "Almond Milk (+$0.75)" },
      { value: "whole-milk", label: "Whole Milk" },
    ],
  },
  {
    id: "iced-coffee-1",
    name: "Iced Coffee",
    description: "Brewed hot over ice",
    image: "/placeholder.svg?height=300&width=300",
    category: "Other Drinks",
    priceMin: 4.0,
    priceMax: 5.0,
    sizes: [
      { value: "small", label: "Small (16oz)", price: 4.0 },
      { value: "large", label: "Large (24oz)", price: 5.0 },
    ],
    options: [
      { value: "extra-shot", label: "Extra Shot (+$1.00)" },
      { value: "vanilla", label: "Vanilla Syrup (+$0.50)" },
    ],
  },
  {
    id: "cold-brew-1",
    name: "Cold Brew",
    description: "Steeped for 24 hours",
    image: "/placeholder.svg?height=300&width=300",
    category: "Other Drinks",
    priceMin: 4.5,
    priceMax: 5.5,
    sizes: [
      { value: "small", label: "Small (16oz)", price: 4.5 },
      { value: "large", label: "Large (24oz)", price: 5.5 },
    ],
    options: [
      { value: "vanilla", label: "Vanilla Syrup (+$0.50)" },
      { value: "caramel", label: "Caramel Syrup (+$0.50)" },
    ],
  },
  {
    id: "chai-latte-1",
    name: "Chai Latte",
    description: "Spiced tea with steamed milk",
    image: "/placeholder.svg?height=300&width=300",
    category: "Other Drinks",
    priceMin: 4.5,
    priceMax: 5.5,
    sizes: [
      { value: "small", label: "Small (12oz)", price: 4.5 },
      { value: "medium", label: "Medium (16oz)", price: 5.0 },
      { value: "large", label: "Large (20oz)", price: 5.5 },
    ],
    options: [
      { value: "oat-milk", label: "Oat Milk (+$0.75)" },
      { value: "almond-milk", label: "Almond Milk (+$0.75)" },
      { value: "whole-milk", label: "Whole Milk" },
    ],
  },
  {
    id: "matcha-latte-1",
    name: "Matcha Latte",
    description: "Japanese green tea with steamed milk",
    image: "/placeholder.svg?height=300&width=300",
    category: "Other Drinks",
    priceMin: 5.0,
    priceMax: 6.0,
    sizes: [
      { value: "small", label: "Small (12oz)", price: 5.0 },
      { value: "medium", label: "Medium (16oz)", price: 5.5 },
      { value: "large", label: "Large (20oz)", price: 6.0 },
    ],
    options: [
      { value: "oat-milk", label: "Oat Milk (+$0.75)" },
      { value: "almond-milk", label: "Almond Milk (+$0.75)" },
      { value: "whole-milk", label: "Whole Milk" },
    ],
  },
];

// Categories
const categories = [
  "All",
  "Coffee",
  "Lattes & Seasonal",
  "Non Food Item",
  "Merchandise",
  "Other Drinks",
];

export default function MenuPage() {
  const router = useRouter();
  const { addItem, itemCount } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("All"); // Changed default to "All"
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedOption, setSelectedOption] = useState("");

  // Filter items by selected category
  const filteredItems =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  // Handle opening the modal
  const openItemModal = (item: MenuItem) => {
    setSelectedItem(item);
    setQuantity(1);
    setSelectedSize(item.sizes?.[0]?.value || "");
    setSelectedOption(item.options?.[0]?.value || "");
  };

  // Handle closing the modal
  const closeItemModal = () => {
    setSelectedItem(null);
  };

  // Handle quantity changes
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  // Get price based on selected size
  const getPrice = () => {
    if (!selectedItem || !selectedSize) return selectedItem?.priceMin || 0;

    const size = selectedItem.sizes?.find((s) => s.value === selectedSize);
    return size?.price || selectedItem.priceMin;
  };

  // Handle adding item to cart
  const handleAddToCart = () => {
    if (!selectedItem || !selectedSize) return;

    const size = selectedItem.sizes?.find((s) => s.value === selectedSize);
    const sizeLabel = size?.label || "";
    const price = size?.price || selectedItem.priceMin;

    addItem({
      id: selectedItem.id,
      name: selectedItem.name,
      price: price,
      image: selectedItem.image,
      quantity: quantity,
      size: sizeLabel,
      options: selectedOption ? [selectedOption] : [],
    });

    toast({
      title: "Added to cart",
      description: `${quantity} x ${selectedItem.name} added to your cart`,
    });

    closeItemModal();
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
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

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Search and Categories */}
          <div className="mb-8 flex flex-wrap items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                type="search"
                placeholder="Search"
                className="pl-10 w-full md:w-auto"
              />
            </div>

            <Tabs
              defaultValue={selectedCategory}
              onValueChange={setSelectedCategory}
              className="w-full md:w-auto"
            >
              <TabsList className="flex w-full flex-wrap md:w-auto">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="text-sm"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Category Title */}
          <h1 className="mb-6 text-3xl font-bold">{selectedCategory}</h1>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="cursor-pointer overflow-hidden rounded-lg border bg-white transition-all hover:shadow-md"
                onClick={() => openItemModal(item)}
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
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

      {/* Product Modal */}
      <Dialog
        open={!!selectedItem}
        onOpenChange={(open) => !open && closeItemModal()}
      >
        <DialogContent className="max-w-md p-0 md:max-w-lg">
          <DialogClose className="absolute left-4 top-4 z-10 rounded-full bg-white p-1 shadow-md">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>

          {selectedItem && (
            <div className="flex flex-col">
              {/* Product Image */}
              <div className="relative h-64 w-full md:h-80">
                <Image
                  src={selectedItem.image || "/placeholder.svg"}
                  alt={selectedItem.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="p-6">
                <h2 className="mb-2 text-2xl font-bold">{selectedItem.name}</h2>
                <p className="mb-4 text-lg">
                  {selectedItem.priceMin.toFixed(2)} US$ -{" "}
                  {selectedItem.priceMax.toFixed(2)} US$
                </p>
                <p className="mb-6 text-gray-600">{selectedItem.description}</p>

                {/* Quantity Selector */}
                <div className="mb-6 flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={decreaseQuantity}
                    className="h-8 w-8 rounded-full"
                  >
                    <Minus className="h-3 w-3" />
                    <span className="sr-only">Decrease quantity</span>
                  </Button>
                  <span className="mx-4 w-4 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={increaseQuantity}
                    className="h-8 w-8 rounded-full"
                  >
                    <Plus className="h-3 w-3" />
                    <span className="sr-only">Increase quantity</span>
                  </Button>
                </div>

                {/* Size Selector */}
                {selectedItem.sizes && selectedItem.sizes.length > 0 && (
                  <div className="mb-6">
                    <p className="mb-2 font-medium">Select size</p>
                    <Select
                      value={selectedSize}
                      onValueChange={setSelectedSize}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedItem.sizes.map((size) => (
                          <SelectItem key={size.value} value={size.value}>
                            {size.label} - ${size.price.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Options Selector */}
                {selectedItem.options && selectedItem.options.length > 0 && (
                  <div className="mb-6">
                    <p className="mb-2 font-medium">Select an option</p>
                    <Select
                      value={selectedOption}
                      onValueChange={setSelectedOption}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select one" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedItem.options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Add to Cart Button */}
                <Button
                  className="w-full rounded-full py-6"
                  onClick={handleAddToCart}
                >
                  Add to cart ${getPrice().toFixed(2)}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
