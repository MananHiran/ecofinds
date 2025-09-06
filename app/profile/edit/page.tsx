"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeftIcon, UserIcon, CameraIcon, SaveIcon } from 'lucide-react';
import Logo from '@/components/Logo';

interface User {
  id: number;
  username: string;
  email: string;
  address: string;
  profilePic?: string;
  createdAt: string;
}

interface FormData {
  username: string;
  address: string;
  profilePic: string;
}

interface FormErrors {
  username?: string;
  address?: string;
  profilePic?: string;
  general?: string;
}

export default function ProfileEditPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    address: '',
    profilePic: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUser(user);
      setFormData({
        username: user.username || '',
        address: user.address || '',
        profilePic: user.profilePic || '',
      
      });
      if (user.profilePic) {
        setImagePreview(user.profilePic);
      }
    } else {
      // Redirect to login if no user data
      router.push('/login');
    }
    setIsLoading(false);
  }, [router]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, general: 'Please select a valid image file' }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, general: 'Image size must be less than 5MB' }));
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, profilePic: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long";
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    } else if (formData.address.length < 10) {
      newErrors.address = "Please enter a complete address (at least 10 characters)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrors({});

    const isValid = validateForm();
    if (!isValid) {
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'user-id': user?.id.toString() || ''
        },
        body: JSON.stringify({
          username: formData.username,
          address: formData.address,
          profilePic: formData.profilePic,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update local storage with new user data
        const updatedUser = { ...user, ...data.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Redirect to profile page
        router.push('/profile');
      } else {
        setErrors({ general: data.error || 'Failed to update profile. Please try again.' });
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsSaving(false);
    }
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
            <Link href="/profile" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <ArrowLeftIcon className="h-6 w-6" />
            </Link>
            <Logo variant="secondary" size="md" />
            <div></div>
          </div>
        </div>
      </div>

      {/* Edit Profile Title Section */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Profile</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Update Your Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.general}</AlertDescription>
                </Alert>
              )}

              {/* Profile Picture Section */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Profile Picture</Label>
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                      {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserIcon className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    <label 
                      htmlFor="profile-pic"
                      className="absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors"
                    >
                      <CameraIcon className="w-4 h-4" />
                    </label>
                    <input
                      id="profile-pic"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Click the camera icon to upload a new profile picture
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Recommended: Square image, max 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className={errors.username ? 'border-red-500' : ''}
                />
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username}</p>
                )}
              </div>

              {/* Email Field (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Email address cannot be changed
                </p>
              </div>

              {/* Address Field */}
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Enter your complete address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && (
                  <p className="text-sm text-red-500">{errors.address}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <SaveIcon className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Link href="/profile">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
