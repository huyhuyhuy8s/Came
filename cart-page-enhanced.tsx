"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, Minus, Plus, Trash2, Gift } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cartStore } from "./patterns/observer/cart-store";
import { useObserver } from "./patterns/observer/use-observer";

export default function CartPageEnhanced() {
  const router = useRouter();
  const cartState = useObserver(cartStore);
  const [tip, setTip] = useState(1);
  const [customTip, setCustomTip] = useState<number | null>(null);

  // Calculate tax (example rate: 8.25%)
  const taxRate = 0.0825;
  const tax = cartState.subtotal * taxRate;

  // Calculate total
  const total = cartState.subtotal + tax + (customTip || tip);

  // Handle tip selection
  const handleTipSelect = (amount: number) => {
    setTip(amount);
    setCustomTip(null);
  };

  // Handle custom tip input
  const handleCustomTip = (value: string) => {
    const amount = Number.parseFloat(value);
    if (!isNaN(amount)) {
      setCustomTip(amount);
    } else {
      setCustomTip(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b py-4">
        <div className="container mx-auto flex items-center justify-between px-4">
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={() => router.push("/menu")}
          >
            <ChevronLeft className="h-4 w-4" />
            Continue Shopping
          </Button>
          <h1 className="text-2xl font-bold">Came</h1>
          <div className="w-[100px]"></div> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-8 text-3xl font-bold">Your cart</h1>

          {cartState.items.length === 0 ? (
            <div className="rounded-lg border p-8 text-center">
              <h2 className="mb-4 text-xl font-medium">Your cart is empty</h2>
              <p className="mb-6 text-gray-600">
                Add some items to your cart to get started.
              </p>
              <Button onClick={() => router.push("/menu")}>Browse Menu</Button>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-3">
              {/* Cart Items */}
              <div className="md:col-span-2">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-medium uppercase">
                    Your order ({cartState.items.length} item
                    {cartState.items.length !== 1 ? "s" : ""})
                  </h2>
                  <Button variant="link" onClick={() => router.push("/menu")}>
                    Edit
                  </Button>
                </div>

                <div className="space-y-6">
                  {cartState.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="font-medium">
                            ₫{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600">
                          ₫{item.price.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">{item.size}</p>
                        {item.options.map((option, index) => (
                          <p key={index} className="text-sm text-gray-600">
                            {option}
                          </p>
                        ))}
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 rounded-full p-0"
                              onClick={() =>
                                cartStore.updateQuantity(
                                  item.id,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-4 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 rounded-full p-0"
                              onClick={() =>
                                cartStore.updateQuantity(
                                  item.id,
                                  item.quantity + 1
                                )
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500"
                            onClick={() => cartStore.removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="mt-6 w-full"
                  onClick={() => router.push("/menu")}
                >
                  Add more items
                </Button>
              </div>

              {/* Order Summary */}
              <div>
                <div className="rounded-lg border p-6">
                  <h2 className="mb-4 text-lg font-medium uppercase">
                    How to get it
                  </h2>

                  <div className="mb-4 space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="mt-1 flex-shrink-0">📍</div>
                      <p>Pickup: 1813 N Milwaukee Ave Ste 1</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="mt-1 flex-shrink-0">🕒</div>
                      <p>Today at 7:15 AM</p>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <h2 className="mb-4 text-lg font-medium uppercase">
                    Add a tip
                  </h2>

                  <div className="mb-6 grid grid-cols-4 gap-2">
                    <Button
                      variant={tip === 1 && !customTip ? "default" : "outline"}
                      onClick={() => handleTipSelect(1)}
                      className="w-full"
                    >
                      ₫1
                    </Button>
                    <Button
                      variant={tip === 2 && !customTip ? "default" : "outline"}
                      onClick={() => handleTipSelect(2)}
                      className="w-full"
                    >
                      ₫2
                    </Button>
                    <Button
                      variant={tip === 3 && !customTip ? "default" : "outline"}
                      onClick={() => handleTipSelect(3)}
                      className="w-full"
                    >
                      ₫3
                    </Button>
                    <Button
                      variant={customTip !== null ? "default" : "outline"} // Highlight if custom tip is active
                      onClick={() => setCustomTip(0)} // Start custom tip input
                      className="w-full"
                    >
                      Other
                    </Button>
                  </div>

                  {customTip !== null && (
                    <div className="mb-6">
                      <Input
                        type="number"
                        placeholder="Enter custom tip amount"
                        value={customTip || ""}
                        onChange={(e) => handleCustomTip(e.target.value)}
                        className="w-full"
                      />
                    </div>
                  )}

                  <Separator className="my-6" />

                  <div className="mb-6">
                    <div className="relative">
                      <Gift className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                      <Input
                        placeholder="Add coupon or gift card"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₫{cartState.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax ({(taxRate * 100).toFixed(2)}%)</span>
                      <span>₫{tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tip</span>
                      <span>₫{(customTip || tip).toFixed(2)}</span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₫{total.toFixed(2)}</span>
                  </div>

                  {customTip !== null && (
                    <div className="mb-6">
                      <Input
                        type="number"
                        placeholder="Enter custom tip amount"
                        value={customTip || ""}
                        onChange={(e) => handleCustomTip(e.target.value)}
                        className="w-full"
                      />
                    </div>
                  )}

                  <Separator className="my-6" />

                  <div className="mb-6">
                    <div className="relative">
                      <Gift className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                      <Input
                        placeholder="Add coupon or gift card"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${cartState.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated taxes (Illinois)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tip</span>
                      <span>${(customTip || tip).toFixed(2)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-medium">
                      <span>Estimated order total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-gray-500">
                    Additional taxes and fees will be calculated at checkout
                  </p>

                  <Button className="mt-6 w-full">Continue to payment</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
