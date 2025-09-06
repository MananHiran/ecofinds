const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

async function seedPurchases() {
  try {
    console.log('Starting to seed purchases...');

    // Get users and products
    const users = await prisma.user.findMany();
    const products = await prisma.product.findMany();

    console.log(`Found ${users.length} users and ${products.length} products`);

    if (users.length === 0 || products.length === 0) {
      console.log('Need at least one user and one product to create purchases');
      return;
    }

    // Clear existing purchases
    await prisma.previousPurchase.deleteMany({});
    console.log('Cleared existing purchases');

    // Create sample purchases
    const samplePurchases = [
      {
        userId: users[0].id,
        productId: products[0].id,
        purchasedAt: new Date('2024-01-15T10:30:00Z'),
      },
      {
        userId: users[0].id,
        productId: products[1]?.id || products[0].id,
        purchasedAt: new Date('2024-01-20T14:45:00Z'),
      },
      {
        userId: users[0].id,
        productId: products[2]?.id || products[0].id,
        purchasedAt: new Date('2024-02-01T09:15:00Z'),
      }
    ];

    // Create purchases
    for (const purchaseData of samplePurchases) {
      if (purchaseData.productId) {
        const purchase = await prisma.previousPurchase.create({
          data: purchaseData,
        });
        console.log(`Created purchase for product ID: ${purchase.productId}`);
      }
    }

    console.log('Successfully seeded purchases!');
  } catch (error) {
    console.error('Error seeding purchases:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedPurchases();
