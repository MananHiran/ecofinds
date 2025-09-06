const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

async function migrateImages() {
  try {
    console.log('Starting image migration...');

    // Get all products with images
    const products = await prisma.product.findMany({
      where: {
        image: {
          not: null
        }
      }
    });

    console.log(`Found ${products.length} products with images`);

    for (const product of products) {
      if (product.image) {
        try {
          // Try to parse as JSON array (new format)
          const images = JSON.parse(product.image);
          
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
          
          console.log(`Migrated ${images.length} images for product: ${product.title}`);
        } catch {
          // Fallback to single image (old format)
          await prisma.productImage.create({
            data: {
              productId: product.id,
              imageUrl: product.image,
              isMain: true,
            }
          });
          
          console.log(`Migrated single image for product: ${product.title}`);
        }
      }
    }

    console.log('Image migration completed successfully!');
  } catch (error) {
    console.error('Error during image migration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateImages();
