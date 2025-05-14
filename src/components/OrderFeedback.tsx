
import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { StarIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import * as notificationService from '@/services/notificationService';

interface OrderFeedbackProps {
  orderId: string;
  open: boolean;
  onClose: () => void;
}

const OrderFeedback: React.FC<OrderFeedbackProps> = ({ orderId, open, onClose }) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to submit feedback",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Store feedback in Supabase - using raw insert to avoid type issues
      // since the order_feedback table was just created
      const { data, error } = await supabase
        .from('order_feedback')
        .insert({
          order_id: orderId,
          user_id: user.id,
          rating,
          comment,
        })
        .select();

      if (error) throw error;

      // Create a notification about the feedback
      await notificationService.createNotification({
        user_id: user.id,
        message: `Thank you for your feedback on order #${orderId.slice(0, 8)}! We appreciate your input.`,
        type: 'system',
      });

      // Success
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback!",
      });

      // Reset form
      setRating(0);
      setComment('');
      
      // Close dialog
      onClose();
      
      // Refresh order data to reflect feedback status
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      queryClient.invalidateQueries({ queryKey: ['user-orders', user.id] });
      
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Error",
        description: "There was a problem submitting your feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate Your Order</DialogTitle>
          <DialogDescription>
            We would love to hear about your experience. Your feedback helps us improve our service.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex justify-center space-x-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                className="focus:outline-none"
              >
                <StarIcon
                  className={`h-8 w-8 ${
                    star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="comment" className="text-sm font-medium">
              Comments (optional)
            </label>
            <Textarea
              id="comment"
              placeholder="Share your thoughts about your order..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Submitting...
              </>
            ) : (
              'Submit Feedback'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderFeedback;
