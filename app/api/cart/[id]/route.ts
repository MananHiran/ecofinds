import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

// DELETE method to remove item from cart
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cartItemId = parseInt(params.id);
    if (isNaN(cartItemId)) {
      return NextResponse.json({ error: 'Invalid cart item ID' }, { status: 400 });
    }

    const userId = request.headers.get('user-id');
    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    // Verify cart item exists and belongs to the user
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      select: { 
        id: true, 
        cartId: true,
        product: {
          select: { title: true }
        }
      }
    });

    if (!cartItem) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
    }

    // Check if the cart belongs to the user
    const cart = await prisma.cart.findUnique({
      where: { id: cartItem.cartId },
      select: { userId: true }
    });

    if (!cart || cart.userId !== parseInt(userId)) {
      return NextResponse.json({ error: 'Unauthorized to remove this cart item' }, { status: 403 });
    }

    // Delete the cart item
    const deletedCartItem = await prisma.cartItem.delete({
      where: { id: cartItemId },
      select: { 
        id: true,
        product: {
          select: { title: true }
        }
      }
    });

    return NextResponse.json({ 
      message: 'Item removed from cart successfully', 
      deletedItem: deletedCartItem 
    }, { status: 200 });

  } catch (error) {
    console.error('Cart item deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
