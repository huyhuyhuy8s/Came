
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  image: string;
  price?: number | { min: number; max: number };
  category: string;
  onClick?: () => void;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  id, 
  name, 
  description, 
  image, 
  price,
  category,
  onClick,
  className 
}) => {
  const formatPrice = () => {
    if (!price) return '';
    
    const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    });
    
    if (typeof price === 'number') {
      return formatter.format(price).replace('₫', 'VND');
    }
    
    return `${formatter.format(price.min).replace('₫', 'VND')}${price.max > price.min ? ` - ${formatter.format(price.max).replace('₫', 'VND')}` : ''}`;
  };
  
  return (
    <div 
      className={cn("bg-white overflow-hidden group cursor-pointer", className)}
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={name}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4 bg-gray-50">
        <h3 className="font-medium text-lg mono">{name}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
        {price && <p className="text-sm font-medium mt-2">{formatPrice()}</p>}
      </div>
    </div>
  );
};

export default ProductCard;
