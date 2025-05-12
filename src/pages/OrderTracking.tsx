
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Clock, Truck, Package, Coffee, X } from 'lucide-react';
import * as orderService from '@/services/orderService';
import { Order, OrderItem } from '@/services/orderService';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const statusSteps = [
  { status: 'pending', icon: Clock, label: 'Order Placed' },
  { status: 'preparing', icon: Coffee, label: 'Preparing' },
  { status: 'packing', icon: Package, label: 'Packing' },
  { status: 'delivering', icon: Truck, label: 'On The Way' },
  { status: 'completed', icon: CheckCircle, label: 'Delivered' }
];

// Status where cancellation is allowed
const CANCELLABLE_STATUSES = ['pending', 'preparing', 'packing'];

const OrderTracking = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const { toast } = useToast();
  
  const fetchOrderDetails = async () => {
    if (!orderId) return;
    
    try {
      setIsLoading(true);
      const orderData = await orderService.getOrderById(orderId);
      
      if (orderData) {
        setOrder(orderData);
        const items = await orderService.getOrderItems(orderId);
        setOrderItems(items);
      } else {
        toast({
          title: "Order not found",
          description: "We couldn't find the order you're looking for",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast({
        title: "Error",
        description: "There was a problem loading your order",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchOrderDetails();
    
    // Refresh order status every 30 seconds
    const intervalId = setInterval(fetchOrderDetails, 30000);
    
    return () => clearInterval(intervalId);
  }, [orderId, toast]);
  
  const getCurrentStep = () => {
    if (!order) return -1;
    return statusSteps.findIndex(step => step.status === order.status);
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };
  
  const handleCancelOrder = async () => {
    if (!orderId) return;
    
    try {
      setIsCancelling(true);
      await orderService.cancelOrder(orderId);
      
      // Update the local state after cancellation
      setOrder(prev => prev ? { ...prev, status: 'cancelled' } : null);
      
      toast({
        title: "Order cancelled",
        description: "Your order has been successfully cancelled",
      });
      
      setCancelDialogOpen(false);
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast({
        title: "Error",
        description: "There was a problem cancelling your order",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };
  
  const canCancel = order && CANCELLABLE_STATUSES.includes(order.status);
  
  if (isLoading) {
    return (
      <div className="py-16 came-container flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="py-16 came-container">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Order Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
          <Link to="/account">
            <Button className="bg-black hover:bg-gray-800">View Your Orders</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const currentStep = getCurrentStep();
  
  return (
    <div className="py-12 came-container">
      <div className="mb-6">
        <Link to="/account" className="text-sm text-gray-600 hover:text-black">
          &larr; Back to Account
        </Link>
      </div>
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mono mb-2">Order Status</h1>
          <p className="text-gray-600">Order #{orderId?.substring(0, 8)}</p>
        </div>
        {canCancel && (
          <Button 
            variant="destructive" 
            onClick={() => setCancelDialogOpen(true)}
            className="ml-4"
          >
            <X size={16} className="mr-1" /> Cancel Order
          </Button>
        )}
        {order.status === 'cancelled' && (
          <div className="px-4 py-2 bg-red-100 text-red-800 rounded-md">
            <p className="font-medium">Order Cancelled</p>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-6">Order Status</h2>
            
            <div className="relative">
              {/* Status line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
              
              {/* Status steps */}
              <div className="space-y-8">
                {statusSteps.map((step, index) => {
                  // For cancelled orders, we only show the first step as completed
                  const isPast = order.status === 'cancelled' 
                    ? index === 0 
                    : index <= currentStep;
                  const isCurrent = order.status === 'cancelled' 
                    ? index === 0
                    : index === currentStep;
                  
                  return (
                    <div key={step.status} className="relative flex items-start pl-12">
                      <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        isPast ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        <step.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className={`font-medium ${isCurrent ? 'text-black' : 'text-gray-700'}`}>
                          {step.label}
                        </h3>
                        {isCurrent && order.status !== 'cancelled' && (
                          <p className="text-sm text-gray-600 mt-1">
                            {step.status === 'pending' && 'We have received your order.'}
                            {step.status === 'preparing' && 'We are preparing your order.'}
                            {step.status === 'packing' && 'Your order is being packed.'}
                            {step.status === 'delivering' && 'Your order is on the way.'}
                            {step.status === 'completed' && 'Your order has been delivered.'}
                          </p>
                        )}
                        {order.status === 'cancelled' && index === 0 && (
                          <p className="text-sm text-red-600 mt-1">
                            Your order has been cancelled.
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            
            <div className="space-y-4">
              {orderItems.map(item => (
                <div key={item.id} className="flex justify-between items-center py-2">
                  <div>
                    <p className="font-medium">{item.product_name}</p>
                    <div className="text-sm text-gray-600">
                      {item.quantity} x {formatPrice(item.price)}
                      {item.size && <span> · Size: {item.size}</span>}
                      {item.options?.length > 0 && (
                        <p>Options: {item.options.join(', ')}</p>
                      )}
                    </div>
                  </div>
                  <div className="font-mono">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Delivery Option</h3>
                <p className="capitalize">{order.delivery_option}</p>
                
                {order.delivery_address && (
                  <p className="text-sm text-gray-600 mt-1">{order.delivery_address}</p>
                )}
                
                {order.delivery_time && (
                  <p className="text-sm text-gray-600 mt-1">Time: {order.delivery_time}</p>
                )}
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
                
                {order.delivery_fee && order.delivery_fee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span>{formatPrice(order.delivery_fee)}</span>
                  </div>
                )}
                
                {order.tip && order.tip > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tip</span>
                    <span>{formatPrice(order.tip)}</span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this order? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setCancelDialogOpen(false)}
              disabled={isCancelling}
            >
              Keep Order
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleCancelOrder}
              disabled={isCancelling}
            >
              {isCancelling ? "Cancelling..." : "Yes, Cancel Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderTracking;
