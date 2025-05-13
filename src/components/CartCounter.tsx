
import React from 'react';
import { useCart } from '@/hooks/useCart';

const CartCounter: React.FC = () => {
  const { items } = useCart();
  
  if (!items.length) return null;
  
  return (
    <div className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
      {items.reduce((total, item) => total + item.quantity, 0)}
    </div>
  );
};

export default CartCounter;
