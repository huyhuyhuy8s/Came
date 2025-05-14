
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import CartCounter from './CartCounter';
import MobileMenu from './MobileMenu';
import { useAuth } from '@/hooks/useAuth';
import NotificationDropdown from './NotificationDropdown';

const Header: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isNotificationOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest('.notification-dropdown') && !target.closest('.notification-icon')) {
          setIsNotificationOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationOpen]);

  return (
    <header className="border-b border-gray-200 py-4 bg-white sticky top-0 z-50">
      <div className="came-container flex items-center justify-between">
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className={cn("text-sm font-medium hover:text-gray-700 transition-colors", 
            isActive('/') ? 'font-bold' : '')}>
            Home
          </Link>
          <Link to="/menu" className={cn("text-sm font-medium hover:text-gray-700 transition-colors",
            isActive('/menu') ? 'font-bold' : '')}>
            Menu
          </Link>
          <Link to="/about" className={cn("text-sm font-medium hover:text-gray-700 transition-colors",
            isActive('/about') ? 'font-bold' : '')}>
            About
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-black"
          >
            Menu
          </Button>
        </div>

        {/* Logo - centered on desktop, left-aligned on mobile */}
        <div className="absolute left-1/2 transform -translate-x-1/2 md:static md:transform-none">
          <Link to="/" className="text-2xl font-bold mono tracking-tight">Came</Link>
        </div>

        <div className="flex items-center space-x-4">
          {!isAuthenticated && (
            <Link to="/signin" className="hidden md:block text-sm hover:underline">
              Sign In
            </Link>
          )}
          
          {/* Notification Icon - Only visible when logged in */}
          {isAuthenticated && (
            <div className="relative notification-icon">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              >
                <Bell className="h-5 w-5" />
              </Button>
              
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 notification-dropdown">
                  <NotificationDropdown onClose={() => setIsNotificationOpen(false)} />
                </div>
              )}
            </div>
          )}
          
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <CartCounter />
          </Link>
          
          <Link to="/account">
            <User className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
};

export default Header;
