"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Logo from '@/components/Logo';
import { 
  ArrowLeftIcon, 
  PackageIcon, 
  UserIcon, 
  TagIcon, 
  IndianRupee,
  CalendarIcon,
  ShoppingBagIcon,
  ShoppingCartIcon
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Purchase {
  id: number;
  product: {
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
  };
  purchasedAt: string;
}

export default function PreviousPurchasesPage() {
  const { isAuthenticated, user, isLoading: authLoading, getUserAvatar } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchPreviousPurchases();
    }
  }, [isAuthenticated, user]);

  const fetchPreviousPurchases = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/purchases/previous', {
        headers: {
          'user-id': user?.id.toString() || ''
        }
      });
      const data = await response.json();

      if (response.ok) {
        setPurchases(data.purchases || []);
      } else {
        setError(data.error || 'Failed to fetch your purchases');
      }
    } catch (error) {
      console.error('Error fetching purchases:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
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

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-white"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Please log in to view your purchases
            </h1>
            <Link href="/login">
              <Button>Go to Login</Button>
            </Link>
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
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <ArrowLeftIcon className="h-6 w-6" />
            </Link>
            <Logo variant="secondary" size="md" />
            <div className="flex items-center space-x-3">
              <Link href="/cart">
                <Button variant="outline" size="sm" className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                  <ShoppingCartIcon className="w-4 h-4 mr-2" />
                  Cart
                </Button>
              </Link>
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {user?.username}
              </span>
              <Link href="/dashboard" className="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden flex-shrink-0 hover:border-green-500 dark:hover:border-green-400 transition-colors">
                <img 
                  src={getUserAvatar()} 
                  alt={user.username}
                  className="w-full h-full object-cover"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Previous Purchases
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View all the eco-friendly products you've purchased
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your purchases...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <ShoppingBagIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Error Loading Purchases
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <Button onClick={fetchPreviousPurchases} variant="outline">
              Try Again
            </Button>
          </div>
        ) : purchases.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBagIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No purchases yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start shopping for eco-friendly products and they'll appear here.
            </p>
            <Link href="/products">
              <Button className="bg-green-600 hover:bg-green-700">
                <PackageIcon className="w-4 h-4 mr-2" />
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                {purchases.length} {purchases.length === 1 ? 'purchase' : 'purchases'} found
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {purchases.map((purchase) => (
                <Card key={purchase.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <Link href={`/products/${purchase.product.id}`}>
                    <div className="aspect-square bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      {purchase.product.images && purchase.product.images.length > 0 ? (
                        <img 
                          src={purchase.product.images[0]} 
                          alt={purchase.product.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <PackageIcon className={`w-16 h-16 text-gray-400 ${purchase.product.images && purchase.product.images.length > 0 ? 'hidden' : ''}`} />
                    </div>
                  </Link>
                  
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                        {purchase.product.title}
                      </h3>
                      <Badge className={getStatusColor(purchase.product.status || 'sold')}>
                        Purchased
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {purchase.product.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <IndianRupee className="w-4 h-4 mr-1" />
                        <span className="font-semibold text-lg text-green-600 dark:text-green-400">
                          ₹{purchase.product.price.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <TagIcon className="w-4 h-4 mr-1" />
                        <span>{purchase.product.category}</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <UserIcon className="w-4 h-4 mr-1" />
                        <span>by {purchase.product.owner.username}</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        <span>Purchased {new Date(purchase.purchasedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <Link href={`/products/${purchase.product.id}`}>
                      <Button className="w-full" variant="outline">
                        View Product Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
