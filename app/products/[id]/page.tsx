"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Logo from '@/components/Logo';
import { 
  ArrowLeftIcon, 
  UserIcon, 
  DollarSignIcon, 
  TagIcon, 
  PackageIcon,
  CalendarIcon,
  MapPinIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
  ShareIcon,
  MessageCircleIcon
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  images: string[];
  status: 'available' | 'sold' | 'pending';
  owner: {
    id: number;
    username: string;
    profilePic?: string;
  };
  createdAt: string;
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  location: string;
  tags: string[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Fetch product data (in a real app, this would be an API call)
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    setIsLoading(true);
    try {
      // Mock data - in a real app, this would be an API call
      const mockProduct: Product = {
        id: parseInt(params.id as string),
        title: 'Organic Cotton Tote Bag',
        description: 'This beautiful organic cotton tote bag is perfect for your daily shopping needs. Made from 100% organic cotton, it\'s durable, eco-friendly, and stylish. The bag features reinforced handles and a spacious interior that can hold up to 20kg. Perfect for grocery shopping, beach trips, or everyday use. The natural cotton material is soft to the touch and becomes more comfortable with each use. This sustainable alternative to plastic bags helps reduce environmental impact while providing a practical and fashionable solution.',
        category: 'Fashion & Accessories',
        price: 25.99,
        images: [
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1584917865442-de9dfe0e4e0e?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop'
        ],
        status: 'available',
        owner: {
          id: 1,
          username: 'EcoFriendlyUser',
          profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
        },
        createdAt: '2024-01-15T10:30:00Z',
        condition: 'like-new',
        location: 'San Francisco, CA',
        tags: ['organic', 'cotton', 'tote', 'eco-friendly', 'sustainable', 'shopping']
      };
      
      setProduct(mockProduct);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextImage = () => {
    if (product) {
      setCurrentImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'sold': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'like-new': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'good': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'fair': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'poor': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">The product you're looking for doesn't exist.</p>
            <Link href="/products">
              <Button>Back to Products</Button>
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
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/products" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <ArrowLeftIcon className="h-6 w-6" />
            </Link>
            <Logo variant="secondary" size="md" />
            <div className="w-6"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Carousel */}
            <div className="space-y-4">
              <div className="relative">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={product.images[currentImageIndex]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800"
                      onClick={prevImage}
                    >
                      <ChevronLeftIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800"
                      onClick={nextImage}
                    >
                      <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  {currentImageIndex + 1} / {product.images.length}
                </div>
              </div>

              {/* Thumbnail Navigation */}
              {product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        index === currentImageIndex
                          ? 'border-green-500 dark:border-green-400'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              {/* Title and Status */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {product.title}
                  </h1>
                  <Badge className={`${getStatusColor(product.status)} px-3 py-1`}>
                    {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    Listed {new Date(product.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    {product.location}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                ${product.price.toFixed(2)}
              </div>

              {/* Category and Condition */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="flex items-center">
                  <TagIcon className="w-3 h-3 mr-1" />
                  {product.category}
                </Badge>
                <Badge className={`${getConditionColor(product.condition)} px-3 py-1`}>
                  {product.condition.charAt(0).toUpperCase() + product.condition.slice(1).replace('-', ' ')}
                </Badge>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="px-2 py-1">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Seller Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Seller Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {product.owner.profilePic ? (
                        <img 
                          src={product.owner.profilePic} 
                          alt={product.owner.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserIcon className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {product.owner.username}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        EcoFinds Member
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-4">
                {product.status === 'available' && (
                  <div className="flex space-x-3">
                    <Button size="lg" className="flex-1 bg-green-600 hover:bg-green-700">
                      <DollarSignIcon className="w-4 h-4 mr-2" />
                      Buy Now
                    </Button>
                    <Button size="lg" variant="outline" className="flex-1">
                      <MessageCircleIcon className="w-4 h-4 mr-2" />
                      Message Seller
                    </Button>
                  </div>
                )}
                
                <div className="flex space-x-3">
                  <Button variant="outline" className="flex-1">
                    <HeartIcon className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <ShareIcon className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
