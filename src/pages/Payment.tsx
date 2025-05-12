
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import * as orderService from '@/services/orderService';
import * as notificationService from '@/services/notificationService';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/hooks/useCart';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const { getCartTotal } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form state
  const [fullName, setFullName] = useState(user?.name || '');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  
  // Order details from location state
  const orderDetails = location.state?.orderDetails;
  
  useEffect(() => {
    if (!orderDetails) {
      toast({
        title: "No order information",
        description: "Please select items and proceed from cart first",
        variant: "destructive",
      });
      navigate('/cart');
    }
  }, [orderDetails, navigate, toast]);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };
  
  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderDetails || !user) {
      toast({
        title: "Error",
        description: "Missing order information or user not authenticated",
        variant: "destructive",
      });
      return;
    }
    
    if (!fullName || !phoneNumber || !email) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Update order with payment information
      const updatedOrder = await orderService.updateOrderStatus(orderDetails.id, 'preparing');
      
      // Create notification for user
      await notificationService.createNotification({
        user_id: user.id,
        message: `Your order is now being prepared. Order #${orderDetails.id.substring(0, 8)}`,
        type: 'order_status',
      });
      
      toast({
        title: "Payment successful",
        description: "Your order is now being prepared",
      });
      
      // Navigate to order tracking page
      navigate(`/order-tracking/${orderDetails.id}`);
      
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment failed",
        description: "There was a problem processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (!orderDetails) {
    return (
      <div className="py-16 came-container text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto"></div>
        <p className="mt-4">Loading order information...</p>
      </div>
    );
  }
  
  return (
    <div className="py-12 came-container">
      <h1 className="text-3xl font-bold mono mb-8">Complete Your Payment</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmitPayment} className="space-y-8">
            <div className="bg-gray-50 p-6 rounded-lg space-y-6">
              <h2 className="text-xl font-semibold">Personal Information</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name*</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phoneNumber">Phone Number*</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address*</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg space-y-6">
              <h2 className="text-xl font-semibold">Payment Method</h2>
              
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-start space-x-2 p-4 border rounded-md">
                  <RadioGroupItem value="cash" id="cash" className="mt-1" />
                  <div>
                    <Label htmlFor="cash" className="font-medium">Cash on Delivery / Pickup</Label>
                    <p className="text-sm text-gray-500">Pay when you receive your order</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 p-4 border rounded-md">
                  <RadioGroupItem value="bank_transfer" id="bank_transfer" className="mt-1" />
                  <div>
                    <Label htmlFor="bank_transfer" className="font-medium">Bank Transfer</Label>
                    <p className="text-sm text-gray-500">
                      Transfer to our account: <br />
                      Bank: VietcomBank<br />
                      Account: 1234567890<br />
                      Name: Came Coffee
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-black hover:bg-gray-800"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                `Complete Order (${formatPrice(orderDetails.total)})`
              )}
            </Button>
          </form>
        </div>
        
        <div>
          <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Delivery Option</h3>
                <p>{orderDetails.delivery_option}</p>
                
                {orderDetails.delivery_address && (
                  <p className="text-sm text-gray-600 mt-1">{orderDetails.delivery_address}</p>
                )}
                
                {orderDetails.delivery_time && (
                  <p className="text-sm text-gray-600 mt-1">Time: {orderDetails.delivery_time}</p>
                )}
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatPrice(orderDetails.subtotal)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>{formatPrice(orderDetails.tax)}</span>
                </div>
                
                {orderDetails.delivery_fee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span>{formatPrice(orderDetails.delivery_fee)}</span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>{formatPrice(orderDetails.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
