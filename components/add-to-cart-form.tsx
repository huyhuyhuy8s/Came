"use client";

import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast"; // Corrected import path

interface AddToCartFormProps {
  product: any;
  sizes: any[];
  options: any[];
}

export function AddToCartForm({ product, sizes, options }: AddToCartFormProps) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState(
    // Use optional chaining and nullish coalescing for safer access
    sizes?.[0]?.value ?? ""
  );
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  // Calculate price based on selections
  const basePrice =
    // Use optional chaining here as well
    sizes?.find((size) => size.value === selectedSize)?.price ??
    product.price_min;
  const optionsPrice = selectedOptions.reduce((total, optionValue) => {
    const option = options.find((opt) => opt.value === optionValue);
    return total + (option?.price_adjustment || 0);
  }, 0);
  const totalPrice = basePrice + optionsPrice;

  const handleOptionToggle = (value: string) => {
    setSelectedOptions((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleAddToCart = async () => {
    const selectedSizeObj = sizes.find((size) => size.value === selectedSize);
    const selectedOptionsLabels = selectedOptions.map((optValue) => {
      const option = options.find((opt) => opt.value === optValue);
      return option?.label || "";
    });

    await addItem({
      id: `${product.id}-${selectedSize}-${selectedOptions.join("-")}`,
      name: product.name,
      price: totalPrice,
      image:
        product.image_url ||
        `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(
          product.name
        )}`,
      quantity,
      size: selectedSizeObj?.label || "",
      options: selectedOptionsLabels,
    });

    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} added to your cart`,
    });
  };

  return (
    <div className="mt-6 space-y-6">
      {/* Add Array.isArray check for robust handling */}
      {Array.isArray(sizes) && sizes.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3">Size</h3>
          <RadioGroup
            value={selectedSize}
            onValueChange={setSelectedSize}
            className="space-y-2"
          >
            {/* No change needed inside map as it's guarded by the check above */}
            {sizes.map((size) => (
              <div key={size.value} className="flex items-center space-x-2">
                <RadioGroupItem value={size.value} id={`size-${size.value}`} />
                <Label
                  htmlFor={`size-${size.value}`}
                  className="flex justify-between w-full"
                >
                  <span>{size.label}</span>
                  <span>₫{size.price.toFixed(2)}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      {/* Add Array.isArray check for options too for consistency */}
      {Array.isArray(options) && options.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3">Options</h3>
          <div className="space-y-2">
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`option-${option.value}`}
                  checked={selectedOptions.includes(option.value)}
                  onCheckedChange={() => handleOptionToggle(option.value)}
                />
                <Label
                  htmlFor={`option-${option.value}`}
                  className="flex justify-between w-full"
                >
                  <span>{option.label}</span>
                  {option.price_adjustment > 0 && (
                    <span>+₫{option.price_adjustment.toFixed(2)}</span>
                  )}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium mb-3">Quantity</h3>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
          >
            -
          </Button>
          <span className="w-8 text-center">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity((prev) => prev + 1)}
          >
            +
          </Button>
        </div>
      </div>

      <div className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-medium">Total:</span>
          <span className="text-2xl font-bold">
            ₫{(totalPrice * quantity).toFixed(2)}
          </span>
        </div>

        <Button onClick={handleAddToCart} className="w-full">
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
