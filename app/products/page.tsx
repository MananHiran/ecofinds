"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Logo from '@/components/Logo';
import { SearchIcon, ArrowLeftIcon, PackageIcon, UserIcon, TagIcon, PlusIcon, IndianRupee } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  image?: string;
  status?: 'available' | 'sold' | 'pending';
  owner: {
    id: number;
    username: string;
    profilePic?: string;
  };
  createdAt: string;
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    const query = searchParams.get('search') || '';
    setSearchQuery(query);
    
    // Fetch products (in a real app, this would be an API call)
    fetchProducts(query);
  }, [searchParams]);

  const fetchProducts = async (searchTerm: string = '') => {
    setIsLoading(true);
    try {
      // Fetch products from API
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        // All products from API are available by default
        const products = data.products || [];
        
        setProducts(products);
        setFilteredProducts(products);
      } else {
        console.error('Error fetching products:', data.error);
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(searchQuery);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'sold':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-white"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <ArrowLeftIcon className="h-6 w-6" />
            </Link>
            <Logo variant="secondary" size="md" />
            <div>
              {isAuthenticated && (
                <Link href="/add-product">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Sell Item
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for eco-friendly products..."
                className="w-full pl-12 pr-4 py-3 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-full focus:border-green-500 dark:focus:border-green-400 focus:ring-0"
              />
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </form>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <PackageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No products found
            </h3>
             <p className="text-gray-600 dark:text-gray-400 mb-6">
               {searchQuery ? `No products match your search for "${searchQuery}"` : 'No eco-friendly products are currently available. Be the first to list a product!'}
             </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {searchQuery ? (
                <Button onClick={() => setSearchQuery('')} variant="outline">
                  Clear Search
                </Button>
              ) : (
                <>
                  {isAuthenticated && (
                    <Link href="/add-product">
                      <Button className="bg-green-600 hover:bg-green-700">
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Add First Product
                      </Button>
                    </Link>
                  )}
                  <Button onClick={() => setSearchQuery('')} variant="outline">
                    Refresh
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                   <div className="aspect-square bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                     {product.image ? (
                       <img 
                         src={product.image} 
                         alt={product.title}
                         className="w-full h-full object-cover"
                         onError={(e) => {
                           // Hide image and show icon if image fails to load
                           e.currentTarget.style.display = 'none';
                           e.currentTarget.nextElementSibling?.classList.remove('hidden');
                         }}
                       />
                     ) : null}
                     <PackageIcon className={`w-16 h-16 text-gray-400 ${product.image ? 'hidden' : ''}`} />
                   </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                        {product.title}
                      </h3>
                      <Badge className={getStatusColor(product.status || 'available')}>
                        {product.status || 'available'}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <IndianRupee className="w-4 h-4 mr-1" />
                       <span className="font-semibold text-lg text-green-600 dark:text-green-400">
                         ₹{product.price.toLocaleString()}
                       </span>
                    </div>
                      
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <TagIcon className="w-4 h-4 mr-1" />
                        <span>{product.category}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <UserIcon className="w-4 h-4 mr-1" />
                        <span>by {product.owner.username}</span>
                      </div>
                    </div>
                    
                     <Button 
                       className="w-full mt-4" 
                       disabled={(product.status || 'available') !== 'available'}
                     >
                       {(product.status || 'available') === 'available' ? 'View Details' : 'Sold Out'}
                     </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button for Mobile */}
      {isAuthenticated && (
        <div className="fixed bottom-6 right-6 z-50 md:hidden">
          <Link href="/add-product">
            <Button
              size="lg"
              className="rounded-full w-14 h-14 bg-green-600 hover:bg-green-700 shadow-lg"
            >
              <PlusIcon className="w-6 h-6" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
