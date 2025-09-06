import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  try {
    const { username, address, profilePic } = await request.json();

    // Validate required fields
    if (!username || !address) {
      return NextResponse.json(
        { error: 'Username and address are required' },
        { status: 400 }
      );
    }

    // Validate username length
    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters long' },
        { status: 400 }
      );
    }

    // Validate address length
    if (address.length < 10) {
      return NextResponse.json(
        { error: 'Please enter a complete address (at least 10 characters)' },
        { status: 400 }
      );
    }

    // For now, we'll use a simple approach where we get the user ID from the request
    // In a real application, you'd get this from a JWT token or session
    const userId = request.headers.get('user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Check if username is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        username: username,
        id: { not: parseInt(userId) }
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 409 }
      );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        username,
        address,
        profilePic: profilePic || null,
      },
      select: {
        id: true,
        username: true,
        email: true,
        address: true,
        profilePic: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser
    }, { status: 200 });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// GET method to fetch user profile
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        username: true,
        email: true,
        address: true,
        profilePic: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
