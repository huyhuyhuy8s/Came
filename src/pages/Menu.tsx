
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard from '@/components/ProductCard';
import ProductDialog from '@/components/ProductDialog';
import { getProducts, getCategories, Product, Category } from '@/services/productService';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const Menu = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | 'all'>('all');
  
  // Fetch products using React Query
  const { 
    data: products = [], 
    isLoading: isLoadingProducts,
    error: productsError
  } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts
  });
  
  // Fetch categories using React Query
  const { 
    data: categories = [], 
    isLoading: isLoadingCategories,
    error: categoriesError
  } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });
  
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };
  
  const closeDialog = () => {
    setIsDialogOpen(false);
  };
  
  // Filter products based on search term and active category
  const filteredProducts = products.filter(product => {
    const matchesSearch = (product.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = activeCategory === 'all' || product.category_id === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Group products by category
  const productsByCategory = categories.reduce<Record<string, Product[]>>((acc, category) => {
    acc[category.id] = filteredProducts.filter(product => product.category_id === category.id);
    return acc;
  }, {});
  
  // Add "All" products group
  const allProductsGroup = { id: 'all', name: 'All Products', description: 'Browse all products' };
  
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
      .format(price)
      .replace('₫', 'VND');
  };
  
  return (
    <div className="py-8 came-container">
      {/* Search and Category Filter */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
        <div className="relative w-full md:w-auto md:flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search menu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex overflow-x-auto space-x-2 w-full md:w-auto scrollbar-hide">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 text-sm whitespace-nowrap rounded-md ${
              activeCategory === 'all' 
                ? 'bg-black text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-3 py-1.5 text-sm whitespace-nowrap rounded-md ${
                activeCategory === category.id 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {(isLoadingProducts || isLoadingCategories) ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      ) : (productsError || categoriesError) ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">Error loading menu</h3>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      ) : (
        <div>
          {activeCategory === 'all' ? (
            <>
              {categories.map(category => (
                <div key={category.id} className="mb-12">
                  <h2 className="text-3xl font-bold mono mb-6">{category.name}</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts
                      .filter(product => product.category_id === category.id)
                      .map(product => (
                        <ProductCard 
                          key={product.id}
                          id={parseInt(product.id)}
                          name={product.name}
                          description={product.description || ''}
                          image={product.image_url || '/placeholder.svg'}
                          price={{ 
                            min: Number(product.price_min), 
                            max: Number(product.price_max) 
                          }}
                          category={category.name}
                          onClick={() => handleProductClick(product)}
                        />
                      ))
                    }
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div>
              {categories
                .filter(category => category.id === activeCategory)
                .map(category => (
                  <div key={category.id}>
                    <h2 className="text-3xl font-bold mono mb-6">{category.name}</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {filteredProducts
                        .filter(product => product.category_id === category.id)
                        .map(product => (
                          <ProductCard 
                            key={product.id}
                            id={parseInt(product.id)}
                            name={product.name}
                            description={product.description || ''}
                            image={product.image_url || '/placeholder.svg'}
                            price={{ 
                              min: Number(product.price_min), 
                              max: Number(product.price_max) 
                            }}
                            category={category.name}
                            onClick={() => handleProductClick(product)}
                          />
                        ))
                      }
                    </div>
                  </div>
                ))}
            </div>
          )}
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      )}

      {/* Product Details Dialog */}
      <ProductDialog 
        product={selectedProduct} 
        open={isDialogOpen} 
        onClose={closeDialog} 
      />
    </div>
  );
};

export default Menu;
