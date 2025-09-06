import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { title, description, category, price, images } = await request.json();

    // Validate required fields
    if (!title || !description || !category || !price) {
      return NextResponse.json(
        { error: 'Title, description, category, and price are required' },
        { status: 400 }
      );
    }

    // Validate title length
    if (title.length < 3 || title.length > 100) {
      return NextResponse.json(
        { error: 'Title must be between 3 and 100 characters' },
        { status: 400 }
      );
    }

    // Validate description length
    if (description.length < 10 || description.length > 1000) {
      return NextResponse.json(
        { error: 'Description must be between 10 and 1000 characters' },
        { status: 400 }
      );
    }

    // Validate price
    if (isNaN(price) || price <= 0 || price > 10000) {
      return NextResponse.json(
        { error: 'Price must be between $0.01 and $10,000' },
        { status: 400 }
      );
    }

    // Validate images
    if (!images || images.length === 0) {
      return NextResponse.json(
        { error: 'At least one image is required' },
        { status: 400 }
      );
    }

    if (images.length > 5) {
      return NextResponse.json(
        { error: 'Maximum 5 images allowed' },
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

    // Create product
    const product = await prisma.product.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        category,
        price,
        image: images[0], // Store first image as main image
        ownerId: parseInt(userId),
      },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        price: true,
        image: true,
        createdAt: true,
        owner: {
          select: {
            id: true,
            username: true,
            profilePic: true,
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Product created successfully',
      product: {
        ...product,
        images: images, // Include all images in response
        status: 'available', // Default status
        condition: 'good', // Default condition
        location: user.address || 'Not specified',
        tags: [], // Default empty tags
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Product creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// GET method to fetch all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            profilePic: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.product.count({ where });

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}