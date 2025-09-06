import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

// POST method to add product to cart
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('user-id');
    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const { productId, quantity = 1 } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify product exists and is available
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
      select: { 
        id: true, 
        title: true, 
        status: true,
        ownerId: true 
      }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (product.status !== 'available' && product.status !== null) {
      return NextResponse.json({ 
        error: 'Product is no longer available',
        productTitle: product.title,
        status: product.status
      }, { status: 400 });
    }

    // Check if user is trying to add their own product
    if (product.ownerId === parseInt(userId)) {
      return NextResponse.json({ 
        error: 'You cannot add your own product to cart' 
      }, { status: 400 });
    }

    // Get or create user's cart
    let cart = await prisma.cart.findUnique({
      where: { userId: parseInt(userId) }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: parseInt(userId) }
      });
    }

    // Check if product is already in cart
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: parseInt(productId)
      }
    });

    if (existingCartItem) {
      // Update quantity if item already exists
      const updatedCartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity }
      });

      return NextResponse.json({
        message: 'Product quantity updated in cart',
        cartItem: updatedCartItem
      }, { status: 200 });
    } else {
      // Add new item to cart
      const cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: parseInt(productId),
          quantity: quantity
        }
      });

      return NextResponse.json({
        message: 'Product added to cart successfully',
        cartItem: cartItem
      }, { status: 201 });
    }

  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
