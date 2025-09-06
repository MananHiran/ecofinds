const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

async function seedProducts() {
  try {
    console.log('Starting to seed products...');

    // First, let's check if we have any users
    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users`);

    if (users.length === 0) {
      console.log('No users found. Please create a user first.');
      return;
    }

    // Use the first user as the owner
    const ownerId = users[0].id;
    console.log(`Using user ${ownerId} as product owner`);

    // Create sample products
    const sampleProducts = [
      {
        title: 'Organic Cotton Tote Bag',
        description: 'Eco-friendly reusable tote bag made from 100% organic cotton. Perfect for grocery shopping and daily use.',
        category: 'Fashion & Accessories',
        price: 1299,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop',
        ownerId: ownerId,
      },
      {
        title: 'Bamboo Water Bottle',
        description: 'Sustainable bamboo water bottle with stainless steel interior. Keeps drinks cold for hours.',
        category: 'Lifestyle',
        price: 1999,
        image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&h=600&fit=crop',
        ownerId: ownerId,
      },
      {
        title: 'Solar Phone Charger',
        description: 'Portable solar charger for phones and small devices. Perfect for outdoor adventures.',
        category: 'Electronics',
        price: 3799,
        image: 'https://images.unsplash.com/photo-1584917865442-de9dfe0e4e0e?w=800&h=600&fit=crop',
        ownerId: ownerId,
      },
      {
        title: 'Compostable Food Containers',
        description: 'Set of 10 compostable food containers for meal prep. Made from plant-based materials.',
        category: 'Home & Garden',
        price: 1099,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop',
        ownerId: ownerId,
      }
    ];

    // Clear existing products
    await prisma.product.deleteMany({});
    console.log('Cleared existing products');

    // Create new products
    for (const productData of sampleProducts) {
      const product = await prisma.product.create({
        data: productData,
      });
      console.log(`Created product: ${product.title}`);
    }

    console.log('Successfully seeded products!');
  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedProducts();
