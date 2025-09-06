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

    // Create sample products with images
    const sampleProducts = [
      {
        title: 'Organic Cotton Tote Bag',
        description: 'Eco-friendly reusable tote bag made from 100% organic cotton. Perfect for grocery shopping and daily use.',
        category: 'Fashion & Accessories',
        price: 1299,
        images: [
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&h=600&fit=crop'
        ],
        ownerId: ownerId,
      },
      {
        title: 'Bamboo Water Bottle',
        description: 'Sustainable bamboo water bottle with stainless steel interior. Keeps drinks cold for hours.',
        category: 'Lifestyle',
        price: 1999,
        images: [
          'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1584917865442-de9dfe0e4e0e?w=800&h=600&fit=crop'
        ],
        ownerId: ownerId,
      },
      {
        title: 'Solar Phone Charger',
        description: 'Portable solar charger for phones and small devices. Perfect for outdoor adventures.',
        category: 'Electronics',
        price: 3799,
        images: [
          'https://images.unsplash.com/photo-1584917865442-de9dfe0e4e0e?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop'
        ],
        ownerId: ownerId,
      },
      {
        title: 'Compostable Food Containers',
        description: 'Set of 10 compostable food containers for meal prep. Made from plant-based materials.',
        category: 'Home & Garden',
        price: 1099,
        images: [
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop'
        ],
        ownerId: ownerId,
      }
    ];

    // Clear existing products and images
    await prisma.productImage.deleteMany({});
    await prisma.product.deleteMany({});
    console.log('Cleared existing products and images');

    // Create new products with images
    for (const productData of sampleProducts) {
      const { images, ...productInfo } = productData;
      
      const product = await prisma.product.create({
        data: productInfo,
      });
      
      // Create ProductImage records for each image
      for (let i = 0; i < images.length; i++) {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            imageUrl: images[i],
            isMain: i === 0, // First image is main
          }
        });
      }
      
      console.log(`Created product: ${product.title} with ${images.length} images`);
    }

    console.log('Successfully seeded products!');
  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedProducts();
