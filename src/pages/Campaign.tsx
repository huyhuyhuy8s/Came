
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { getCampaignById, Campaign as CampaignType } from '@/services/campaignService';
import { CalendarDays } from 'lucide-react';

const Campaign = () => {
  const { id } = useParams<{ id: string }>();
  
  const { 
    data: campaign, 
    isLoading,
    error
  } = useQuery({
    queryKey: ['campaign', id],
    queryFn: () => id ? getCampaignById(id) : Promise.resolve(null),
    enabled: !!id
  });
  
  if (isLoading) {
    return (
      <div className="py-16 came-container flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }
  
  if (error || !campaign) {
    return (
      <div className="py-16 came-container">
        <h1 className="text-3xl font-bold mono mb-8">Campaign Not Found</h1>
        <p className="text-gray-600 mb-6">
          The campaign you're looking for doesn't exist or has expired.
        </p>
        <Link to="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    );
  }
  
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
      .format(price)
      .replace('₫', 'VND');
  };
  
  const startDate = new Date(campaign.start_date).toLocaleDateString('vi-VN');
  const endDate = new Date(campaign.end_date).toLocaleDateString('vi-VN');
  const isActive = new Date() <= new Date(campaign.end_date) && campaign.is_active;
  
  return (
    <div className="py-16 came-container">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mono mb-6">{campaign.title}</h1>
        
        {campaign.image_url && (
          <div className="aspect-video overflow-hidden rounded-lg mb-8">
            <img 
              src={campaign.image_url} 
              alt={campaign.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="flex items-center gap-2 text-gray-600 mb-6">
          <CalendarDays size={20} />
          <span>Valid from {startDate} to {endDate}</span>
          {isActive ? (
            <span className="ml-auto bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</span>
          ) : (
            <span className="ml-auto bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Expired</span>
          )}
        </div>
        
        <div className="prose max-w-none">
          <p className="mb-6 text-lg">{campaign.description}</p>
        </div>
        
        <div className="mt-8">
          <Link to="/menu">
            <Button className="bg-black hover:bg-gray-800">
              Order Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Campaign;
