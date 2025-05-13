
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { createSupportTicket } from '@/services/supportService';
import { CheckCircle } from 'lucide-react';

interface SupportTicketFormProps {
  onSuccess?: () => void;
}

const SupportTicketForm: React.FC<SupportTicketFormProps> = ({ onSuccess }) => {
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      toast({
        title: "Description required",
        description: "Please describe your issue before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    if (!isAuthenticated || !user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to submit a support ticket.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createSupportTicket({
        user_id: user.id,
        issue_description: description,
      });
      
      setIsSubmitted(true);
      setDescription('');
      
      toast({
        title: "Support ticket submitted",
        description: "We'll get back to you as soon as possible.",
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting support ticket:', error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your ticket. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isSubmitted) {
    return (
      <div className="bg-green-50 p-6 rounded-lg text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-12 w-12 text-green-500" />
        </div>
        <h3 className="text-xl font-medium mb-2">Support Ticket Submitted</h3>
        <p className="text-gray-600 mb-4">
          Thank you for reaching out. Our team will review your issue and respond as soon as possible.
        </p>
        <Button 
          variant="outline" 
          onClick={() => setIsSubmitted(false)}
        >
          Submit Another Ticket
        </Button>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Describe your issue
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Please provide details about the issue you're experiencing..."
          className="min-h-32"
        />
      </div>
      
      <Button 
        type="submit" 
        className="bg-black hover:bg-gray-800 w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
            <span>Submitting...</span>
          </div>
        ) : (
          "Submit Support Ticket"
        )}
      </Button>
    </form>
  );
};

export default SupportTicketForm;
