import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

// DELETE method to delete a product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    // Get user ID from headers
    const userId = request.headers.get('user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Find the product and verify ownership
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, title: true, ownerId: true }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if user owns the product
    if (product.ownerId !== parseInt(userId)) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this product' },
        { status: 403 }
      );
    }

    // Delete the product (images will be deleted automatically due to cascade)
    await prisma.product.delete({
      where: { id: productId }
    });

    return NextResponse.json({
      message: 'Product deleted successfully',
      deletedProduct: {
        id: product.id,
        title: product.title
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Product delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
