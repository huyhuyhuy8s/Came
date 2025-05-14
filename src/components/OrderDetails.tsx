
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getOrderById, getOrderItems, getOrderFeedbackStatus, Order, OrderItem, cancelOrder } from '@/services/orderService';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Truck, PackageCheck, XCircle, Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import OrderFeedback from './OrderFeedback';

interface OrderDetailsProps {
  orderId: string;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ orderId }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const { data: order, isLoading: isOrderLoading, error: orderError, refetch: refetchOrder } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderById(orderId),
  });

  const { data: orderItems, isLoading: isOrderItemsLoading, error: orderItemsError } = useQuery({
    queryKey: ['orderItems', orderId],
    queryFn: () => getOrderItems(orderId),
  });
  
  const { data: hasFeedback, isLoading: isFeedbackLoading } = useQuery({
    queryKey: ['orderFeedback', orderId],
    queryFn: () => getOrderFeedbackStatus(orderId),
    enabled: order?.status === 'completed'
  });

  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelOrder = async () => {
    setIsCancelling(true);
    try {
      if (!orderId) throw new Error("Order ID is missing.");
      if (!user) throw new Error("User not authenticated.");

      await cancelOrder(orderId);

      toast({
        title: "Order Cancelled",
        description: "Your order has been successfully cancelled.",
      });
      
      refetchOrder();
    } catch (error: any) {
      console.error("Error cancelling order:", error);
      toast({
        title: "Error",
        description: "There was a problem cancelling your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
      .format(price)
      .replace('₫', 'VND');
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'packing':
        return 'bg-purple-100 text-purple-800';
      case 'delivering':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isOrderLoading || isOrderItemsLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (orderError || orderItemsError) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium mb-2">Error loading order details</h3>
        <p className="text-gray-600 mb-4">Could not load the order information.</p>
        <Link to="/account">
          <Button>Go to Account</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {order && (
        <>
          <div className="bg-gray-50 rounded-lg p-8 space-y-6">
            <h2 className="text-2xl font-semibold">Order Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <strong>Order ID:</strong> {order.id}
              </div>
              <div>
                <strong>Order Date:</strong> {format(new Date(order.created_at), 'MMMM dd, yyyy')}
              </div>
              <div>
                <strong>Delivery Option:</strong> {order.delivery_option}
              </div>
              {order.delivery_address && (
                <div>
                  <strong>Delivery Address:</strong> {order.delivery_address}
                </div>
              )}
              {order.delivery_time && (
                <div>
                  <strong>Delivery Time:</strong> {order.delivery_time}
                </div>
              )}
              <div>
                <strong>Subtotal:</strong> {formatPrice(order.subtotal)}
              </div>
              <div>
                <strong>Tax:</strong> {formatPrice(order.tax)}
              </div>
              {order.delivery_fee !== null && (
                <div>
                  <strong>Delivery Fee:</strong> {formatPrice(order.delivery_fee)}
                </div>
              )}
              <div>
                <strong>Total:</strong> {formatPrice(order.total)}
              </div>
              <div>
                <strong>Status:</strong>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>

            <Separator className="my-4" />

            <h3 className="text-xl font-medium">Order Items</h3>
            <ul className="space-y-4">
              {orderItems && orderItems.map((item) => (
                <li key={item.id} className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                    {/* Assuming you have a way to fetch the image URL based on product_id */}
                    <img
                      src={`/images/products/product-${item.product_id}.jpg`}
                      alt={item.product_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{item.product_name}</h4>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    <p className="text-sm text-gray-500">Price: {formatPrice(item.price)}</p>
                    {item.options && item.options.length > 0 && (
                      <p className="text-sm text-gray-500">Options: {item.options.join(', ')}</p>
                    )}
                    {item.size && (
                      <p className="text-sm text-gray-500">Size: {item.size}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
            {order.status === 'pending' && (
              <Button
                variant="destructive"
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="w-full md:w-auto"
              >
                {isCancelling ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Cancelling...
                  </>
                ) : (
                  <>
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel Order
                  </>
                )}
              </Button>
            )}

            {order.status === 'completed' && !hasFeedback && !isFeedbackLoading && (
              <Button
                variant="outline"
                onClick={() => setIsFeedbackOpen(true)}
                className="w-full md:w-auto"
              >
                <Star className="mr-2 h-4 w-4" />
                Leave Feedback
              </Button>
            )}

            {order.status === 'completed' && hasFeedback && (
              <div className="bg-green-50 text-green-700 px-4 py-2 rounded-md flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Feedback submitted
              </div>
            )}
          </div>
          
          <OrderFeedback 
            orderId={orderId} 
            open={isFeedbackOpen} 
            onClose={() => setIsFeedbackOpen(false)} 
          />
        </>
      )}
    </div>
  );
};

export default OrderDetails;
