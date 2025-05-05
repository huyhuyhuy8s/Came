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
import { toast } from "@/components/ui/use-toast";
import { UserMenu } from "@/components/user-menu";

// Import our patterns
import { ProductCustomizer } from "./patterns/decorator/product-customizer";
import { BaseCoffee } from "./patterns/decorator/product-decorator";
import { MenuItemRegistry } from "./patterns/factory/menu-item-factory";
import { cartStore } from "./patterns/observer/cart-store";
import { useObserver } from "./patterns/observer/use-observer";

// Categories
const categories = [
  "All",
  "Coffee",
  "Lattes & Seasonal",
  "Non Food Item",
  "Merchandise",
  "Other Drinks",
];

// Create menu items using our factory
const createMenuItems = () => {
  const coffeeFactory = MenuItemRegistry.getFactory("coffee");
  const latteFactory = MenuItemRegistry.getFactory("latte");
  const coldDrinkFactory = MenuItemRegistry.getFactory("cold-drink");

  return [
    coffeeFactory.createCompleteMenuItem(
      "drip-coffee-1",
      "Drip Coffee",
      "Batch brewed coffee",
      "/placeholder.svg?height=300&width=300"
    ),
    latteFactory.createCompleteMenuItem(
      "latte-1",
      "Latte",
      "Espresso with steamed milk",
      "/placeholder.svg?height=300&width=300"
    ),
    latteFactory.createCompleteMenuItem(
      "cappuccino-1",
      "Cappuccino",
      "Espresso with equal parts steamed milk and foam",
      "/placeholder.svg?height=300&width=300"
    ),
    coldDrinkFactory.createCompleteMenuItem(
      "iced-coffee-1",
      "Iced Coffee",
      "Brewed hot over ice",
      "/placeholder.svg?height=300&width=300"
    ),
    coldDrinkFactory.createCompleteMenuItem(
      "cold-brew-1",
      "Cold Brew",
      "Steeped for 24 hours",
      "/placeholder.svg?height=300&width=300"
    ),
    coldDrinkFactory.createCompleteMenuItem(
      "chai-latte-1",
      "Chai Latte",
      "Spiced tea with steamed milk",
      "/placeholder.svg?height=300&width=300",
      [
        { value: "small", label: "Small (12oz)", price: 4.5 },
        { value: "medium", label: "Medium (16oz)", price: 5.0 },
        { value: "large", label: "Large (20oz)", price: 5.5 },
      ],
      [
        { value: "oat-milk", label: "Oat Milk (+$0.75)" },
        { value: "almond-milk", label: "Almond Milk (+$0.75)" },
        { value: "whole-milk", label: "Whole Milk" },
      ]
    ),
    coldDrinkFactory.createCompleteMenuItem(
      "matcha-latte-1",
      "Matcha Latte",
      "Japanese green tea with steamed milk",
      "/placeholder.svg?height=300&width=300",
      [
        { value: "small", label: "Small (12oz)", price: 5.0 },
        { value: "medium", label: "Medium (16oz)", price: 5.5 },
        { value: "large", label: "Large (20oz)", price: 6.0 },
      ],
      [
        { value: "oat-milk", label: "Oat Milk (+$0.75)" },
        { value: "almond-milk", label: "Almond Milk (+$0.75)" },
        { value: "whole-milk", label: "Whole Milk" },
      ]
    ),
  ];
};

const menuItems = createMenuItems();

export default function MenuPageEnhanced() {
  const router = useRouter();
  const cartState = useObserver(cartStore);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedOption, setSelectedOption] = useState("");

  // Filter items by selected category
  const filteredItems =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  // Handle opening the modal
  const openItemModal = (item: any) => {
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

    const size = selectedItem.sizes?.find((s: any) => s.value === selectedSize);
    return size?.price || selectedItem.priceMin;
  };

  // Handle adding item to cart using our decorator pattern
  const handleAddToCart = () => {
    if (!selectedItem || !selectedSize) return;

    const size = selectedItem.sizes?.find((s: any) => s.value === selectedSize);
    const sizeLabel = size?.label || "";
    const basePrice = size?.price || selectedItem.priceMin;

    // Create base product
    let product = new BaseCoffee(
      selectedItem.name,
      selectedItem.description,
      basePrice
    );

    // Apply decorators based on selected options
    if (selectedOption === "oat-milk") {
      product = ProductCustomizer.addOatMilk(product);
    } else if (selectedOption === "almond-milk") {
      product = ProductCustomizer.addAlmondMilk(product);
    } else if (selectedOption === "extra-shot") {
      product = ProductCustomizer.addExtraShot(product);
    } else if (selectedOption === "vanilla") {
      product = ProductCustomizer.addVanillaSyrup(product);
    }

    // Add to cart using our observer pattern
    cartStore.addItem({
      id: selectedItem.id,
      name: product.getName(),
      price: product.getPrice(),
      image: selectedItem.image,
      quantity: quantity,
      size: sizeLabel,
      options: selectedOption ? [selectedOption] : [],
    });

    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.getName()} added to your cart`,
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
              {cartState.itemCount > 0 && (
                <Badge
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                  variant="destructive"
                >
                  {cartState.itemCount}
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
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="mt-2 font-medium">
                    ₫{item.priceMin.toFixed(2)}
                  </p>
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

      {/* Item Detail Modal */}
      <Dialog open={!!selectedItem} onOpenChange={closeItemModal}>
        <DialogContent className="sm:max-w-[425px]">
          {selectedItem && (
            <>
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-4"
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
              <div className="grid gap-4 py-4">
                <div className="relative h-48 w-full overflow-hidden rounded-md">
                  <Image
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h2 className="text-xl font-bold">{selectedItem.name}</h2>
                <p className="text-sm text-gray-600">
                  {selectedItem.description}
                </p>

                {/* Size Selection */}
                {selectedItem.sizes && selectedItem.sizes.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Size</h3>
                    <Select
                      value={selectedSize}
                      onValueChange={setSelectedSize}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedItem.sizes.map((size: any) => (
                          <SelectItem key={size.value} value={size.value}>
                            {size.label} - ₫{size.price.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Option Selection */}
                {selectedItem.options && selectedItem.options.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Options</h3>
                    <Select
                      value={selectedOption}
                      onValueChange={setSelectedOption}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedItem.options.map((option: any) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Quantity */}
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Quantity</h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={decreaseQuantity}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span>{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={increaseQuantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button onClick={handleAddToCart} className="mt-4 w-full">
                  Add {quantity} to Cart - ₫{(getPrice() * quantity).toFixed(2)}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
