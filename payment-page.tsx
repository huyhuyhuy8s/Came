"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, CreditCard, Check } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useCart } from "@/context/cart-context";

// Form validation schema
const paymentFormSchema = z.object({
  cardName: z.string().min(2, { message: "Name on card is required" }),
  cardNumber: z
    .string()
    .regex(/^\d{16}$/, { message: "Card number must be 16 digits" }),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, {
      message: "Expiry date must be in MM/YY format",
    }),
  cvv: z.string().regex(/^\d{3,4}$/, { message: "CVV must be 3 or 4 digits" }),
  billingAddress: z.string().min(5, { message: "Billing address is required" }),
  saveCard: z.boolean().default(false),
});

export default function PaymentPage() {
  const router = useRouter();
  const { clearCart } = useCart();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  // Initialize form
  const form = useForm<z.infer<typeof paymentFormSchema>>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      billingAddress: "",
      saveCard: false,
    },
  });

  // Load order details from localStorage
  useEffect(() => {
    const storedOrderDetails = localStorage.getItem("orderDetails");
    if (storedOrderDetails) {
      setOrderDetails(JSON.parse(storedOrderDetails));
    } else {
      router.push("/cart");
    }
  }, [router]);

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");

    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }

    return v;
  };

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof paymentFormSchema>) => {
    setIsLoading(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate random order number
      const randomOrderNumber = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      setOrderNumber(randomOrderNumber);

      // Show confirmation dialog
      setShowConfirmation(true);

      // Clear cart
      clearCart();

      // Clear order details from localStorage
      localStorage.removeItem("orderDetails");
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle confirmation dialog close
  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    router.push("/");
  };

  if (!orderDetails) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b py-4">
        <div className="container mx-auto flex items-center justify-between px-4">
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={() => router.push("/cart")}
          >
            <ChevronLeft className="h-4 w-4" />
            Back to cart
          </Button>
          <h1 className="text-2xl font-bold">Came</h1>
          <div className="w-[100px]"></div> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-8 text-3xl font-bold">Payment</h1>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Payment Form */}
            <div className="md:col-span-2">
              <div className="rounded-lg border p-6">
                <h2 className="mb-6 text-xl font-medium">Payment Method</h2>

                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="mb-6 space-y-3"
                >
                  <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
                    <RadioGroupItem value="credit-card" id="credit-card" />
                    <Label
                      htmlFor="credit-card"
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <CreditCard className="h-4 w-4" /> Credit or Debit Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
                    <RadioGroupItem value="apple-pay" id="apple-pay" />
                    <Label htmlFor="apple-pay" className="cursor-pointer">
                      Apple Pay
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
                    <RadioGroupItem value="google-pay" id="google-pay" />
                    <Label htmlFor="google-pay" className="cursor-pointer">
                      Google Pay
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "credit-card" && (
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="cardName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name on card</FormLabel>
                            <FormControl>
                              <Input placeholder="John Smith" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cardNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Card number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="1234 5678 9012 3456"
                                {...field}
                                onChange={(e) => {
                                  const formatted = formatCardNumber(
                                    e.target.value
                                  );
                                  e.target.value = formatted;
                                  field.onChange(
                                    e.target.value.replace(/\s/g, "")
                                  );
                                }}
                                maxLength={19}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="expiryDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expiry date</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="MM/YY"
                                  {...field}
                                  onChange={(e) => {
                                    const formatted = formatExpiryDate(
                                      e.target.value
                                    );
                                    e.target.value = formatted;
                                    field.onChange(e.target.value);
                                  }}
                                  maxLength={5}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="cvv"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CVV</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="123"
                                  {...field}
                                  type="password"
                                  maxLength={4}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="billingAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Billing address</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="123 Main St, City, State, ZIP"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="saveCard"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Save card for future purchases
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="mt-6 w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? "Processing..." : "Pay now"}
                      </Button>
                    </form>
                  </Form>
                )}

                {(paymentMethod === "apple-pay" ||
                  paymentMethod === "google-pay") && (
                  <div className="rounded-md border border-dashed p-8 text-center">
                    <p className="mb-4 text-muted-foreground">
                      {paymentMethod === "apple-pay"
                        ? "Apple Pay"
                        : "Google Pay"}{" "}
                      is not available in this demo.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Please select Credit or Debit Card to continue.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="rounded-lg border p-6">
                <h2 className="mb-4 text-xl font-medium">Order Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₫{orderDetails.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₫{orderDetails.tax.toFixed(2)}</span>
                  </div>
                  {orderDetails.deliveryFee > 0 && (
                    <div className="flex justify-between">
                      <span>Delivery fee</span>
                      <span>₫{orderDetails.deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  {orderDetails.shippingFee > 0 && (
                    <div className="flex justify-between">
                      <span>Shipping fee</span>
                      <span>₫{orderDetails.shippingFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tip</span>
                    <span>₫{orderDetails.tip.toFixed(2)}</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₫{orderDetails.total.toFixed(2)}</span>
                </div>

                <Separator className="my-6" />

                <h3 className="mb-3 font-medium">Order Details</h3>
                <p className="text-sm text-muted-foreground">
                  {orderDetails.deliveryOption === "pickup"
                    ? "Pickup"
                    : "Delivery"}{" "}
                  at {orderDetails.timeSlot}
                </p>
                {orderDetails.address && (
                  <p className="text-sm text-muted-foreground">
                    Address: {orderDetails.address}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Order Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={handleConfirmationClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-2 text-center">
              <Check className="h-6 w-6 text-green-500" /> Order Confirmed!
            </DialogTitle>
            <DialogDescription className="text-center">
              Your order has been successfully placed.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 text-center">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="text-xl font-bold">{orderNumber}</p>
            </div>
            <p>
              Thank you for your order! We'll send a confirmation email with
              your order details and tracking information.
            </p>
            <div className="mt-4">
              <Button onClick={handleConfirmationClose} className="w-full">
                Continue Shopping
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Label component for the payment page
function Label({
  children,
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement> & { className?: string }) {
  return (
    <label
      className={`text-sm font-medium leading-none ${className || ""}`}
      {...props}
    >
      {children}
    </label>
  );
}
