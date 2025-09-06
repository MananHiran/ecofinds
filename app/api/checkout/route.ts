import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

// POST method to process checkout
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('user-id');
    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId: parseInt(userId) },
      include: {
        items: {
          include: {
            product: {
              include: {
                owner: {
                  select: {
                    id: true,
                    username: true,
                    profilePic: true,
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Check if all products are still available
    const unavailableProducts = cart.items.filter(item => 
      item.product.status !== 'available' && item.product.status !== null
    );

    if (unavailableProducts.length > 0) {
      return NextResponse.json({ 
        error: 'Some products are no longer available',
        unavailableProducts: unavailableProducts.map(item => ({
          id: item.product.id,
          title: item.product.title,
          status: item.product.status
        }))
      }, { status: 400 });
    }

    // Start transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Create purchase records for each item
      const purchases = [];
      for (const cartItem of cart.items) {
        const purchase = await tx.previousPurchase.create({
          data: {
            userId: parseInt(userId),
            productId: cartItem.product.id,
            purchasedAt: new Date(),
          }
        });
        purchases.push(purchase);

        // Mark product as sold
        await tx.product.update({
          where: { id: cartItem.product.id },
          data: { status: 'sold' }
        });
      }

      // Clear the cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      });

      return {
        purchases,
        totalItems: cart.items.length,
        totalAmount: cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
      };
    });

    return NextResponse.json({
      message: 'Checkout successful!',
      orderId: `ORDER-${Date.now()}`,
      totalItems: result.totalItems,
      totalAmount: result.totalAmount,
      purchases: result.purchases.map(purchase => ({
        id: purchase.id,
        productId: purchase.productId,
        purchasedAt: purchase.purchasedAt.toISOString()
      }))
    }, { status: 200 });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
