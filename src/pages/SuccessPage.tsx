
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface LocationState {
  title?: string;
  message?: string;
  redirectPath?: string;
  redirectText?: string;
}

const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  
  // Default values if no state is provided
  const title = state?.title || 'Success!';
  const message = state?.message || 'The operation completed successfully.';
  const redirectPath = state?.redirectPath || '/';
  const redirectText = state?.redirectText || 'Return to Home';

  return (
    <div className="py-20 came-container">
      <div className="max-w-md mx-auto text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-20 w-20 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold mono mb-4">{title}</h1>
        <p className="text-gray-600 mb-8">{message}</p>
        
        <Button 
          onClick={() => navigate(redirectPath)} 
          className="bg-black hover:bg-gray-800"
        >
          {redirectText}
        </Button>
      </div>
    </div>
  );
};

export default SuccessPage;
