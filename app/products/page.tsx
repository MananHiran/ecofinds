"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Logo from '@/components/Logo';
import { SearchIcon, ArrowLeftIcon, PackageIcon, UserIcon, DollarSignIcon, TagIcon } from 'lucide-react';

interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  image?: string;
  status: 'available' | 'sold' | 'pending';
  owner: {
    id: number;
    username: string;
  };
  createdAt: string;
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
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
      // Mock data - in a real app, this would be an API call
      const mockProducts: Product[] = [
        {
          id: 1,
          title: 'Organic Cotton Tote Bag',
          description: 'Eco-friendly reusable tote bag made from 100% organic cotton',
          category: 'Fashion',
          price: 15.99,
          image: '/api/placeholder/300/200',
          status: 'available',
          owner: { id: 1, username: 'EcoWarrior' },
          createdAt: '2024-01-15'
        },
        {
          id: 2,
          title: 'Bamboo Water Bottle',
          description: 'Sustainable bamboo water bottle with stainless steel interior',
          category: 'Lifestyle',
          price: 24.99,
          image: '/api/placeholder/300/200',
          status: 'available',
          owner: { id: 2, username: 'GreenLiving' },
          createdAt: '2024-01-14'
        },
        {
          id: 3,
          title: 'Solar Phone Charger',
          description: 'Portable solar charger for phones and small devices',
          category: 'Electronics',
          price: 45.99,
          image: '/api/placeholder/300/200',
          status: 'sold',
          owner: { id: 3, username: 'SolarTech' },
          createdAt: '2024-01-13'
        },
        {
          id: 4,
          title: 'Compostable Food Containers',
          description: 'Set of 10 compostable food containers for meal prep',
          category: 'Kitchen',
          price: 12.99,
          image: '/api/placeholder/300/200',
          status: 'available',
          owner: { id: 4, username: 'ZeroWaste' },
          createdAt: '2024-01-12'
        }
      ];

      // Filter products based on search term
      const filtered = mockProducts.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setProducts(mockProducts);
      setFilteredProducts(filtered);
    } catch (error) {
      console.error('Error fetching products:', error);
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
            <div></div>
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
              {searchQuery ? `No products match your search for "${searchQuery}"` : 'No products available at the moment'}
            </p>
            <Button onClick={() => setSearchQuery('')} variant="outline">
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <PackageIcon className="w-16 h-16 text-gray-400" />
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                      {product.title}
                    </h3>
                    <Badge className={getStatusColor(product.status)}>
                      {product.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <DollarSignIcon className="w-4 h-4 mr-1" />
                      <span className="font-semibold text-lg text-green-600 dark:text-green-400">
                        ${product.price}
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
                    disabled={product.status !== 'available'}
                  >
                    {product.status === 'available' ? 'View Details' : 'Sold Out'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
