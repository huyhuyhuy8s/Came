
import React, { useState, useEffect } from 'react';
import { getOrderItems, OrderItem } from '@/services/orderService';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Package } from 'lucide-react';

interface OrderDetailsProps {
  orderId: string;
  status: string;
  total: number;
  subtotal: number;
  tax: number;
  deliveryFee?: number;
  deliveryOption: string;
  deliveryTime?: string | null;
  deliveryAddress?: string | null;
  createdAt?: string | null;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  orderId,
  status,
  total,
  subtotal,
  tax,
  deliveryFee = 0,
  deliveryOption,
  deliveryTime,
  deliveryAddress,
  createdAt,
}) => {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const orderItems = await getOrderItems(orderId);
        setItems(orderItems);
      } catch (error) {
        console.error('Error fetching order items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [orderId]);

  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-medium">Order #{orderId.slice(0, 8)}</h3>
        <Badge className={getStatusColor()}>{status}</Badge>
      </div>

      {isLoading ? (
        <div className="py-8 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <div>
                  <p className="font-medium">
                    {item.quantity} × {item.product_name}
                  </p>
                  {item.size && <p className="text-sm text-gray-600">Size: {item.size}</p>}
                  {item.options && item.options.length > 0 && (
                    <p className="text-sm text-gray-600">Options: {item.options.join(', ')}</p>
                  )}
                </div>
                <p className="font-mono">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-mono">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-mono">${tax.toFixed(2)}</span>
            </div>
            {deliveryOption === 'delivery' && (
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-mono">${deliveryFee.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span className="font-mono">${total.toFixed(2)}</span>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-gray-600 mt-0.5" />
              <div>
                <p className="font-medium">Order Type</p>
                <p className="text-gray-600 capitalize">{deliveryOption}</p>
              </div>
            </div>

            {deliveryOption === 'delivery' && deliveryAddress && (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="font-medium">Delivery Address</p>
                  <p className="text-gray-600">{deliveryAddress}</p>
                </div>
              </div>
            )}

            {deliveryTime && (
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="font-medium">
                    {deliveryOption === 'delivery'
                      ? 'Delivery Time'
                      : deliveryOption === 'takeaway'
                      ? 'Pickup Time'
                      : 'Time'}
                  </p>
                  <p className="text-gray-600">{deliveryTime}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-gray-600 mt-0.5" />
              <div>
                <p className="font-medium">Order Placed</p>
                <p className="text-gray-600">{formatDate(createdAt)}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderDetails;
