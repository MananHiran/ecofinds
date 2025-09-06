import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

// GET method to fetch user's cart items
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

    // First get or create user's cart
    let cart = await prisma.cart.findUnique({
      where: { userId: parseInt(userId) }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: parseInt(userId) }
      });
    }

    // Fetch user's cart items
    const cartItems = await prisma.cartItem.findMany({
      where: {
        cartId: cart.id
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
      orderBy: { id: 'desc' }, // Most recent first
    });

    // Format cart items for frontend
    const formattedCartItems = cartItems.map(cartItem => ({
      id: cartItem.id,
      product: {
        ...cartItem.product,
        status: cartItem.product.status || 'available',
        images: cartItem.product.images.map(img => img.imageUrl), // Extract image URLs
      },
      quantity: cartItem.quantity,
      addedAt: new Date().toISOString(), // Default to current time since addedAt doesn't exist in schema
    }));

    return NextResponse.json({
      cartItems: formattedCartItems,
      total: cartItems.length
    }, { status: 200 });

  } catch (error) {
    console.error('Cart fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
