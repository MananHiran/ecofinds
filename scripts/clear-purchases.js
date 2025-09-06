const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

async function clearAllPurchases() {
  try {
    console.log('🗑️  Clearing all purchase history...');
    
    // Delete all previous purchases
    const result = await prisma.previousPurchase.deleteMany({});
    
    console.log(`✅ Successfully deleted ${result.count} purchase records`);
    
    // Verify the deletion
    const remainingPurchases = await prisma.previousPurchase.count();
    console.log(`📊 Remaining purchase records: ${remainingPurchases}`);
    
  } catch (error) {
    console.error('❌ Error clearing purchases:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearAllPurchases();
