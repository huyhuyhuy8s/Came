
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import SupportTicketForm from '@/components/SupportTicketForm';
import { MessageCircle, X } from 'lucide-react';

const SupportButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleOpen = () => setIsOpen(!isOpen);
  const handleClose = () => setIsOpen(false);
  const handleSuccess = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 3000);
  };
  
  return (
    <>
      <div className="fixed bottom-6 left-6 z-40">
        <Button 
          onClick={toggleOpen}
          className="h-12 w-12 rounded-full bg-black hover:bg-gray-800 p-0 shadow-lg flex items-center justify-center"
        >
          {isOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <MessageCircle className="h-5 w-5" />
          )}
          <span className="sr-only">Support</span>
        </Button>
      </div>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Need Help?</DialogTitle>
            <DialogDescription>
              Submit a support ticket and we'll get back to you as soon as possible.
            </DialogDescription>
          </DialogHeader>
          
          <SupportTicketForm onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SupportButton;
