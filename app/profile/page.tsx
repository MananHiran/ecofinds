"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeftIcon, EditIcon, MapPinIcon, CalendarIcon, MailIcon, UserIcon } from 'lucide-react';
import Logo from '@/components/Logo';

interface User {
  id: number;
  username: string;
  email: string;
  address: string;
  profilePic?: string;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      // Redirect to login if no user data
      router.push('/login');
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

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

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <ArrowLeftIcon className="h-6 w-6" />
            </Link>
            <Logo variant="secondary" size="md" />
            <Button onClick={handleLogout} variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Title Section */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {/* Profile Picture Section */}
                <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 h-32">
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                    <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
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
                  </div>
                </div>
                
                {/* Profile Info */}
                <div className="pt-16 pb-6 px-6 text-center">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    {user.username}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                    {user.email}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    EcoFinds Member
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Products Listed</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Items Purchased</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Member Since</span>
                  <span className="font-semibold text-sm">
                    {new Date(user.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">Personal Information</CardTitle>
                <Link href="/profile/edit">
                  <Button variant="outline" size="sm">
                    <EditIcon className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                      <UserIcon className="w-4 h-4 mr-2" />
                      Username
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">{user.username}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                      <MailIcon className="w-4 h-4 mr-2" />
                      Email
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">{user.email}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                    <MapPinIcon className="w-4 h-4 mr-2" />
                    Address
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">{user.address || 'No address provided'}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Member Since
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {new Date(user.createdAt).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Activity Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Activity Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">0</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Products Listed</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">0</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Items Sold</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">0</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Items Purchased</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activity</p>
                  <p className="text-sm">Start listing or purchasing eco-friendly products!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
