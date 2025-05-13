
import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <div className="p-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold mono" onClick={onClose}>
          Came
        </Link>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-6 w-6" />
        </Button>
      </div>
      <nav className="flex flex-col p-8 space-y-6">
        <Link to="/" className="text-xl font-medium" onClick={onClose}>
          Home
        </Link>
        <Link to="/menu" className="text-xl font-medium" onClick={onClose}>
          Menu
        </Link>
        <Link to="/about" className="text-xl font-medium" onClick={onClose}>
          About us
        </Link>
        <Link to="/signin" className="text-xl font-medium" onClick={onClose}>
          Sign In
        </Link>
        <Link to="/cart" className="text-xl font-medium" onClick={onClose}>
          Cart
        </Link>
        <Link to="/account" className="text-xl font-medium" onClick={onClose}>
          My Account
        </Link>
      </nav>
    </div>
  );
};

export default MobileMenu;
