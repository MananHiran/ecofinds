import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

// GET method to fetch a single product by ID
export async function GET(
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

    const product = await prisma.product.findUnique({
      where: { id: productId },
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
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Add additional fields for the product detail page
    const productWithDetails = {
      ...product,
      status: product.status || 'available',
      condition: 'good', // Default condition
      location: 'Not specified', // Default location
      tags: [], // Default empty tags
      images: product.images.map(img => img.imageUrl), // Extract image URLs
      createdAt: product.createdAt.toISOString(),
    };

    return NextResponse.json({
      product: productWithDetails
    }, { status: 200 });

  } catch (error) {
    console.error('Product fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
