
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getActiveCampaigns, Campaign } from '@/services/campaignService';

const Index = () => {
  // Fetch active campaigns
  const { 
    data: campaigns = [], 
    isLoading: isLoadingCampaigns
  } = useQuery({
    queryKey: ['active-campaigns'],
    queryFn: getActiveCampaigns
  });

  // Format price in VND
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
      .format(price)
      .replace('₫', 'VND');
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="came-container grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mono mb-6">Experience Coffee Like Never Before</h1>
            <p className="text-gray-600 mb-8">
              At Came, we believe in crafting exceptional coffee experiences that delight your senses 
              and energize your day. Our artisanal approach to coffee brings you the finest flavors from around the world.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/menu">
                <Button className="bg-black hover:bg-gray-800">View Our Menu</Button>
              </Link>
              <Link to="/about">
                <Button variant="outline">Learn More</Button>
              </Link>
            </div>
          </div>
          <div className="relative h-64 md:h-96 overflow-hidden rounded-lg">
            <img 
              src="/menu_cover_image/hero-image.png" 
              alt="Delicious coffee" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 came-container">
        <h2 className="text-3xl font-bold mono mb-8">Our Specialty Coffee</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg overflow-hidden shadow-sm border">
            <img 
              src="/our_specialty_coffee/signature-blend.png"
              alt="Coffee" 
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-medium text-lg">Signature Blend</h3>
              <p className="text-gray-600 text-sm mt-2">Our house specialty with notes of chocolate and caramel</p>
              <p className="text-sm font-medium mt-2">{formatPrice(25000)}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg overflow-hidden shadow-sm border">
            <img 
              src="/our_specialty_coffee/artisanal-latte.png" 
              alt="Latte" 
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-medium text-lg">Artisanal Latte</h3>
              <p className="text-gray-600 text-sm mt-2">Smooth espresso with expertly steamed milk and intricate latte art</p>
              <p className="text-sm font-medium mt-2">{formatPrice(30000)}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg overflow-hidden shadow-sm border">
            <img 
              src="/our_specialty_coffee/cold-brew.png" 
              alt="Iced Coffee" 
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-medium text-lg">Cold Brew</h3>
              <p className="text-gray-600 text-sm mt-2">Steeped for 12 hours for a smooth, refreshing experience</p>
              <p className="text-sm font-medium mt-2">{formatPrice(35000)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Campaigns Section */}
      <section className="py-16 bg-gray-50">
        <div className="came-container">
          <h2 className="text-3xl font-bold mono mb-8">Current Promotions</h2>
          
          {isLoadingCampaigns ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
          ) : campaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <Link to={`/campaign/${campaign.id}`} key={campaign.id}>
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition-shadow">
                    {campaign.image_url ? (
                      <img 
                        src={campaign.image_url} 
                        alt={campaign.title} 
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No image available</span>
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-medium text-lg">{campaign.title}</h3>
                      <p className="text-gray-600 text-sm mt-2 line-clamp-2">{campaign.description}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Valid until {new Date(campaign.end_date).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No active promotions at this time. Check back soon for new offers!</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 came-container">
        <h2 className="text-3xl font-bold mono mb-8">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 mr-4">
                <img 
                  src="/customer_menu_avatar/alex-johnson.png" 
                  alt="Alex Johnson"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium">Alex Johnson</h4>
                <p className="text-sm text-gray-500">Coffee Enthusiast</p>
              </div>
            </div>
            <p className="text-gray-600">"The attention to detail in every cup is remarkable. Came has become my daily ritual, and I couldn't be happier with the quality and service."</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 mr-4">
                <img 
                  src="/customer_menu_avatar/sarah-williams.png" 
                  alt="Sarah Williams"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium">Sarah Williams</h4>
                <p className="text-sm text-gray-500">Food Blogger</p>
              </div>
            </div>
            <p className="text-gray-600">"As someone who tries cafes all over the city, I can confidently say that Came offers one of the most authentic and delicious coffee experiences around."</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 mr-4">
                <img 
                  src="/customer_menu_avatar/michael-chen.png" 
                  alt="Michael Chen"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium">Michael Chen</h4>
                <p className="text-sm text-gray-500">Regular Customer</p>
              </div>
            </div>
            <p className="text-gray-600">"What keeps me coming back is not just the exceptional coffee, but the warm atmosphere and friendly staff who remember my name and usual order."</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="came-container text-center">
          <h2 className="text-3xl font-bold mono mb-6">Ready to Experience Came?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Visit us today and discover why our customers can't start their day without a cup of Came coffee.
          </p>
          <Link to="/menu">
            <Button className="bg-white text-black hover:bg-gray-200">Order Now</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
