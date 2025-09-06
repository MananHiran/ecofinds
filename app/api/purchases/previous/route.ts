import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

// GET method to fetch user's previous purchases
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

    // Fetch user's previous purchases
    const purchases = await prisma.previousPurchase.findMany({
      where: {
        userId: parseInt(userId)
      },
      include: {
        product: {
          include: {
            owner: {
              select: {
                id: true,
                username: true,
                profilePic: true,
              }
            },
            images: {
              orderBy: { isMain: 'desc' }, // Main image first
            }
          }
        }
      },
      orderBy: { purchasedAt: 'desc' }, // Most recent first
    });

    // Format purchases for frontend
    const formattedPurchases = purchases.map(purchase => ({
      id: purchase.id,
      product: {
        ...purchase.product,
        status: purchase.product.status || 'sold', // Mark as sold since it was purchased
        images: purchase.product.images.map(img => img.imageUrl), // Extract image URLs
      },
      purchasedAt: purchase.purchasedAt.toISOString(),
    }));

    return NextResponse.json({
      purchases: formattedPurchases,
      total: purchases.length
    }, { status: 200 });

  } catch (error) {
    console.error('Previous purchases fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
