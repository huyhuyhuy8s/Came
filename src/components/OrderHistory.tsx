
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserOrders, Order, getOrderFeedbackStatus } from '@/services/orderService';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Star, CheckCircle } from 'lucide-react';
import OrderFeedback from './OrderFeedback';

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

const OrderHistory: React.FC = () => {
  const { user } = useAuth();
  const [feedbackOrderId, setFeedbackOrderId] = useState<string | null>(null);
  const [orderFeedbackStatus, setOrderFeedbackStatus] = useState<Record<string, boolean>>({});
  
  const {
    data: orders = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['user-orders', user?.id],
    queryFn: () => user ? getUserOrders(user.id) : Promise.resolve([]),
    enabled: !!user
  });
  
  // Check feedback status for completed orders
  React.useEffect(() => {
    const checkFeedbackStatus = async () => {
      const completedOrders = orders.filter(order => order.status === 'completed');
      if (completedOrders.length > 0) {
        const feedbackStatuses: Record<string, boolean> = {};
        
        for (const order of completedOrders) {
          try {
            const hasFeedback = await getOrderFeedbackStatus(order.id);
            feedbackStatuses[order.id] = hasFeedback;
          } catch (error) {
            console.error(`Error checking feedback for order ${order.id}:`, error);
          }
        }
        
        setOrderFeedbackStatus(feedbackStatuses);
      }
    };
    
    if (orders.length > 0) {
      checkFeedbackStatus();
    }
  }, [orders]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium mb-2">Error loading orders</h3>
        <p className="text-gray-600 mb-4">Could not load your order history.</p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }
  
  if (orders.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg p-8">
        <h3 className="text-lg font-medium mb-2">No Orders Found</h3>
        <p className="text-gray-600 mb-4">You haven't made any orders yet.</p>
        <Link to="/menu">
          <Button>Browse Menu</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Order History</h2>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">
                  {order.id.substring(0, 8)}...
                </TableCell>
                <TableCell>
                  {new Date(order.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>{formatPrice(order.total)}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Link to={`/order-tracking/${order.id}`}>
                    <Button variant="outline" size="sm">
                      Track Order
                    </Button>
                  </Link>
                  
                  {order.status === 'completed' && !orderFeedbackStatus[order.id] && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setFeedbackOrderId(order.id)}
                      className="ml-2"
                    >
                      <Star className="h-4 w-4 mr-1" />
                      Rate
                    </Button>
                  )}
                  
                  {order.status === 'completed' && orderFeedbackStatus[order.id] && (
                    <span className="inline-flex items-center ml-2 text-xs text-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Rated
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Feedback Dialog */}
      {feedbackOrderId && (
        <OrderFeedback
          orderId={feedbackOrderId}
          open={!!feedbackOrderId}
          onClose={() => {
            setFeedbackOrderId(null);
            // Update feedback status and refetch orders
            refetch();
          }}
        />
      )}
    </div>
  );
};

export default OrderHistory;
