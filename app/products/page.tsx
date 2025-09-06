"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Logo from '@/components/Logo';
import { SearchIcon, ArrowLeftIcon, PackageIcon, UserIcon, TagIcon, PlusIcon, IndianRupee, FilterIcon, XIcon, SlidersHorizontalIcon, ShoppingCartIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  images: string[];
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
  const { isAuthenticated, user, getUserAvatar } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  // Filter states
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  useEffect(() => {
    const query = searchParams.get('search') || '';
    setSearchQuery(query);
    
    // Fetch products (in a real app, this would be an API call)
    fetchProducts(query);
  }, [searchParams]);

  // Apply filters when products or filters change
  useEffect(() => {
    applyFilters();
  }, [products, filters, searchQuery]);

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
        
        // Extract unique categories
        const categories = [...new Set(products.map((product: Product) => product.category))] as string[];
        setAvailableCategories(categories);
        
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

  // Apply filters and sorting
  const applyFilters = () => {
    let filtered = [...products];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(product => (product.status || 'available') === filters.status);
    }

    // Apply price range filter
    if (filters.minPrice) {
      filtered = filtered.filter(product => product.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(product => product.price <= parseFloat(filters.maxPrice));
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-a-z':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-z-a':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    setFilteredProducts(filtered);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: '',
      status: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'newest'
    });
    setSearchQuery('');
    fetchProducts('');
  };

  // Update filter and apply
  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
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
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link href="/add-product">
                    <Button className="bg-green-600 hover:bg-green-700">
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Sell Item
                    </Button>
                  </Link>
                  <Link href="/cart">
                    <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                      <ShoppingCartIcon className="w-4 h-4 mr-2" />
                      Cart
                    </Button>
                  </Link>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {user?.username}
                    </span>
                    <Link href="/dashboard" className="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden flex-shrink-0 hover:border-green-500 dark:hover:border-green-400 transition-colors">
                      <img 
                        src={getUserAvatar()} 
                        alt={user?.username || 'User'}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                  </div>
                </>
              ) : (
                <Link href="/login">
                  <Button>Get Started</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
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
            
            {/* Filter Toggle Button - COMMENTED OUT */}
            {/* <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <SlidersHorizontalIcon className="w-4 h-4" />
              Filters
              {(filters.category || filters.status || filters.minPrice || filters.maxPrice || filters.sortBy !== 'newest') && (
                <Badge variant="secondary" className="ml-1">
                  {[filters.category, filters.status, filters.minPrice, filters.maxPrice, filters.sortBy !== 'newest' ? 'sort' : ''].filter(Boolean).length}
                </Badge>
              )}
            </Button> */}
          </div>
        </div>
      </div>

      {/* Filters Section - COMMENTED OUT */}
      {/* {showFilters && (
        <div className="bg-gray-50 dark:bg-gray-900 border-b">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {availableCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Min Price (₹)
                </label>
                <Input
                  type="number"
                  placeholder="Min price"
                  value={filters.minPrice}
                  onChange={(e) => updateFilter('minPrice', e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Price (₹)
                </label>
                <Input
                  type="number"
                  placeholder="Max price"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilter('maxPrice', e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sort By
                </label>
                <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name-a-z">Name: A to Z</SelectItem>
                    <SelectItem value="name-z-a">Name: Z to A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {filteredProducts.length} of {products.length} products
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <XIcon className="w-4 h-4" />
                  Clear Filters
                </Button>
                <Button
                  onClick={() => setShowFilters(false)}
                  variant="outline"
                  size="sm"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )} */}

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
            </h1>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {filteredProducts.length} of {products.length} products
            </div>
          </div>
          
          {/* Active Filters - COMMENTED OUT */}
          {/* {(filters.category || filters.status || filters.minPrice || filters.maxPrice || filters.sortBy !== 'newest') && (
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
              {filters.category && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Category: {filters.category}
                  <button
                    onClick={() => updateFilter('category', '')}
                    className="ml-1 hover:text-red-500"
                  >
                    <XIcon className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.status && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Status: {filters.status}
                  <button
                    onClick={() => updateFilter('status', '')}
                    className="ml-1 hover:text-red-500"
                  >
                    <XIcon className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.minPrice && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Min: ₹{filters.minPrice}
                  <button
                    onClick={() => updateFilter('minPrice', '')}
                    className="ml-1 hover:text-red-500"
                  >
                    <XIcon className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.maxPrice && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Max: ₹{filters.maxPrice}
                  <button
                    onClick={() => updateFilter('maxPrice', '')}
                    className="ml-1 hover:text-red-500"
                  >
                    <XIcon className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.sortBy !== 'newest' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Sort: {filters.sortBy.replace('-', ' ')}
                  <button
                    onClick={() => updateFilter('sortBy', 'newest')}
                    className="ml-1 hover:text-red-500"
                  >
                    <XIcon className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
          )} */}
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
                <Button 
                  onClick={() => {
                    setSearchQuery('');
                    fetchProducts('');
                  }} 
                  variant="outline"
                >
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
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer relative">
                   <div className="aspect-square bg-gray-200 dark:bg-gray-700 flex items-center justify-center relative">
                     {product.images && product.images.length > 0 ? (
                       <img 
                         src={product.images[0]} 
                         alt={product.title}
                         className={`w-full h-full object-cover ${product.status === 'sold' ? 'opacity-50' : ''}`}
                         onError={(e) => {
                           // Hide image and show icon if image fails to load
                           e.currentTarget.style.display = 'none';
                           e.currentTarget.nextElementSibling?.classList.remove('hidden');
                         }}
                       />
                     ) : null}
                     <PackageIcon className={`w-16 h-16 text-gray-400 ${product.images && product.images.length > 0 ? 'hidden' : ''}`} />
                     {product.status === 'sold' && (
                       <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                         <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                           SOLD
                         </div>
                       </div>
                     )}
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
