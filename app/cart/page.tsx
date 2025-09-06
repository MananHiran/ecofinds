"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Logo from '@/components/Logo';
import { 
  ArrowLeftIcon, 
  PackageIcon, 
  UserIcon, 
  TagIcon, 
  IndianRupee,
  ShoppingCartIcon,
  TrashIcon,
  MinusIcon
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface CartItem {
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
  quantity: number;
  addedAt: string;
}

export default function CartPage() {
  const { isAuthenticated, user, isLoading: authLoading, getUserAvatar } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingItemId, setRemovingItemId] = useState<number | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [soldProducts, setSoldProducts] = useState<CartItem[]>([]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchCartItems();
    }
  }, [isAuthenticated, user]);

  const fetchCartItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/cart', {
        headers: {
          'user-id': user?.id.toString() || ''
        }
      });
      const data = await response.json();

      if (response.ok) {
        const allItems = data.cartItems || [];
        const availableItems = allItems.filter((item: CartItem) => item.product.status === 'available');
        const soldItems = allItems.filter((item: CartItem) => item.product.status === 'sold');
        
        setCartItems(availableItems);
        setSoldProducts(soldItems);
      } else {
        setError(data.error || 'Failed to fetch cart items');
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    setRemovingItemId(cartItemId);
    try {
      const response = await fetch(`/api/cart/${cartItemId}`, {
        method: 'DELETE',
        headers: {
          'user-id': user?.id.toString() || ''
        }
      });
      const data = await response.json();

      if (response.ok) {
        setCartItems(prev => prev.filter(item => item.id !== cartItemId));
      } else {
        setError(data.error || 'Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      setError('Network error. Please try again.');
    } finally {
      setRemovingItemId(null);
    }
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    setError(null);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'user-id': user?.id.toString() || ''
        }
      });
      const data = await response.json();

      if (response.ok) {
        setCheckoutSuccess(true);
        setCartItems([]); // Clear cart items
        // Redirect to previous purchases after a short delay
        setTimeout(() => {
          window.location.href = '/previous-purchases';
        }, 2000);
      } else {
        setError(data.error || 'Checkout failed');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsCheckingOut(false);
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

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
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
              Please log in to view your cart
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
            Shopping Cart
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review your selected eco-friendly products
          </p>
          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your cart...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <ShoppingCartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Error Loading Cart
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <Button onClick={fetchCartItems} variant="outline">
              Try Again
            </Button>
          </div>
        ) : checkoutSuccess ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Checkout Successful!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your order has been processed successfully. Redirecting to your purchase history...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Your cart is empty
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
            {soldProducts.length > 0 && (
              <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.726-1.36 3.491 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Some items are no longer available
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                      <p>The following items have been sold and have been removed from your cart:</p>
                      <ul className="mt-2 list-disc list-inside">
                        {soldProducts.map((item) => (
                          <li key={item.id}>{item.product.title}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((cartItem) => (
                  <Card key={cartItem.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="flex">
                      <Link href={`/products/${cartItem.product.id}`} className="flex-shrink-0">
                        <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          {cartItem.product.images && cartItem.product.images.length > 0 ? (
                            <img 
                              src={cartItem.product.images[0]} 
                              alt={cartItem.product.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <PackageIcon className={`w-12 h-12 text-gray-400 ${cartItem.product.images && cartItem.product.images.length > 0 ? 'hidden' : ''}`} />
                        </div>
                      </Link>
                      
                      <CardContent className="flex-1 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <Link href={`/products/${cartItem.product.id}`}>
                            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 hover:text-green-600 dark:hover:text-green-400">
                              {cartItem.product.title}
                            </h3>
                          </Link>
                          <Badge className={getStatusColor(cartItem.product.status || 'available')}>
                            {cartItem.product.status || 'available'}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {cartItem.product.description}
                        </p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <TagIcon className="w-4 h-4 mr-1" />
                            <span>{cartItem.product.category}</span>
                          </div>

                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <UserIcon className="w-4 h-4 mr-1" />
                            <span>by {cartItem.product.owner.username}</span>
                          </div>

                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <span>Quantity: {cartItem.quantity}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-lg font-semibold text-green-600 dark:text-green-400">
                            <IndianRupee className="w-5 h-5 mr-1" />
                            <span>₹{(cartItem.product.price * cartItem.quantity).toLocaleString()}</span>
                          </div>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                disabled={removingItemId === cartItem.id}
                              >
                                <TrashIcon className="w-4 h-4 mr-1" />
                                {removingItemId === cartItem.id ? 'Removing...' : 'Remove'}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove from Cart</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove "{cartItem.product.title}" from your cart? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => removeFromCart(cartItem.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Remove
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-4">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Order Summary
                    </h3>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Subtotal ({cartItems.length} items)</span>
                        <span className="font-medium">₹{calculateTotal().toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                        <span className="font-medium text-green-600">Free</span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Total</span>
                          <span className="text-green-600">₹{calculateTotal().toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 mb-3"
                      onClick={handleCheckout}
                      disabled={isCheckingOut}
                    >
                      {isCheckingOut ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        'Proceed to Checkout'
                      )}
                    </Button>
                    
                    <Link href="/products" className="block">
                      <Button variant="outline" className="w-full">
                        Continue Shopping
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
