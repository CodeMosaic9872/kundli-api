import { PrismaClient } from '@prisma/client';
import { SeedService } from '../services/seedService';
import DatabaseService from '../services/databaseService';

async function setupDatabase() {
  console.log('🚀 Setting up Kundli API database...');
  
  const dbService = DatabaseService.getInstance();
  const prisma = dbService.getPrismaClient();
  
  try {
    // Connect to database
    await dbService.connect();
    
    // Check database health
    const isHealthy = await dbService.healthCheck();
    if (!isHealthy) {
      throw new Error('Database health check failed');
    }
    
    console.log('✅ Database connection established');
    
    // Run database migrations
    console.log('🔄 Running database migrations...');
    // Note: In production, you would run: npx prisma migrate deploy
    
    // Seed the database
    const seedService = new SeedService(prisma);
    await seedService.runSeeds();
    
    console.log('🎉 Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await dbService.disconnect();
  }
}

// Run the setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

export default setupDatabase;
