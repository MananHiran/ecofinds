"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { UserIcon, HomeIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface User {
  id: number;
  username: string;
  email: string;
  address?: string;
  fyPic?: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login if not authenticated
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <Link href="/" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <HomeIcon className="h-6 w-6" />
            </Link>
            <Logo variant="secondary" size="md" />
            <Button onClick={logout} variant="outline">
              Logout
            </Button>
          </div>

          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome to EcoFinds Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Hello, {user.username}! Manage your eco-friendly products here.
            </p>
          </div>

          {/* User Info Card */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Account Information
              </h2>
              <Link href="/profile">
                <Button variant="outline" size="sm">
                  View Profile
                </Button>
              </Link>
            </div>
            
            {/* Profile Image and Basic Info */}
            <div className="flex items-center space-x-8">
              <div className="w-24 h-24 rounded-full border-4 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                {user.profilePic ? (
                  <img 
                    src={user.profilePic} 
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <div className="flex items-center space-x-8">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Username
                  </label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.username}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Email
                  </label>
                  <p className="text-gray-900 dark:text-white">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Member Since
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                My Products
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Manage your eco-friendly product listings
              </p>
              <div className="space-y-2">
                <Link href="/add-product" className="block">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Add New Product
                  </Button>
                </Link>
                <Button className="w-full" variant="outline">View My Products</Button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Shopping Cart
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Review items in your cart
              </p>
              <Button className="w-full" variant="outline">View Cart</Button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Purchase History
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Track your eco-friendly purchases
              </p>
              <Button className="w-full" variant="outline">View History</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
