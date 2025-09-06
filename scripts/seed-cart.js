const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

async function seedCart() {
  try {
    console.log('Starting to seed cart items...');

    // Get users and products
    const users = await prisma.user.findMany();
    const products = await prisma.product.findMany();

    console.log(`Found ${users.length} users and ${products.length} products`);

    if (users.length === 0 || products.length === 0) {
      console.log('Need at least one user and one product to create cart items');
      return;
    }

    // Clear existing cart items and carts
    await prisma.cartItem.deleteMany({});
    await prisma.cart.deleteMany({});
    console.log('Cleared existing cart items and carts');

    // Create cart for user
    const cart = await prisma.cart.create({
      data: {
        userId: users[0].id,
      }
    });
    console.log(`Created cart for user ID: ${users[0].id}`);

    // Create sample cart items
    const sampleCartItems = [
      {
        cartId: cart.id,
        productId: products[0].id,
        quantity: 2,
      },
      {
        cartId: cart.id,
        productId: products[1]?.id || products[0].id,
        quantity: 1,
      },
      {
        cartId: cart.id,
        productId: products[2]?.id || products[0].id,
        quantity: 3,
      }
    ];

    // Create cart items
    for (const cartItemData of sampleCartItems) {
      if (cartItemData.productId) {
        const cartItem = await prisma.cartItem.create({
          data: cartItemData,
        });
        console.log(`Created cart item for product ID: ${cartItem.productId}`);
      }
    }

    console.log('Successfully seeded cart items!');
  } catch (error) {
    console.error('Error seeding cart items:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedCart();
