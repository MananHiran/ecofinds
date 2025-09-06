import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

// GET method to fetch current user's products
export async function GET(request: NextRequest) {
  try {
    // Get user ID from headers
    const userId = request.headers.get('user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch user's products
    const products = await prisma.product.findMany({
      where: {
        ownerId: parseInt(userId)
      },
      include: {
        images: {
          orderBy: { isMain: 'desc' }, // Main image first
        }
      },
      orderBy: { createdAt: 'desc' }, // Most recent first
    });

    // Format products for frontend
    const formattedProducts = products.map(product => ({
      ...product,
      status: product.status || 'available',
      condition: 'good', // Default condition
      location: 'Not specified', // Default location
      tags: [], // Default empty tags
      images: product.images.map(img => img.imageUrl), // Extract image URLs
      createdAt: product.createdAt.toISOString(),
    }));

    return NextResponse.json({
      products: formattedProducts,
      total: products.length
    }, { status: 200 });

  } catch (error) {
    console.error('My listings fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
