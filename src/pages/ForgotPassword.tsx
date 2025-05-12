
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ForgotPassword = () => {
  const location = useLocation();
  const initialEmail = location.state?.email || '';
  const [email, setEmail] = useState(initialEmail);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await resetPassword(email);
      setIsSuccess(true);
      toast({
        title: "Success",
        description: "Password reset email sent. Please check your inbox.",
      });
    } catch (error) {
      console.error('Reset password error:', error);
      toast({
        title: "Error",
        description: "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="py-12 came-container">
      <div className="max-w-md mx-auto">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate('/signin')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sign In
        </Button>
        
        <h1 className="text-3xl font-bold mono mb-4">Reset Password</h1>
        <p className="text-gray-600 mb-8">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
        
        {isSuccess ? (
          <div className="bg-green-50 text-green-800 p-4 rounded-md mb-8">
            <h3 className="font-medium">Reset Email Sent</h3>
            <p className="text-sm mt-1">
              Please check your email for instructions to reset your password.
              If you don't see it within a few minutes, check your spam folder.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-black hover:bg-gray-800"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
