import { PrismaClient } from '@prisma/client';

export class SeedService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Seed the database with initial Koota rules data
   */
  async seedKootaRules(): Promise<void> {
    console.log('🌱 Seeding Koota rules...');

    // Seed Varna rules
    await this.seedVarnaRules();
    
    // Seed Vashya rules
    await this.seedVashyaRules();
    
    // Seed Tara rules
    await this.seedTaraRules();
    
    // Seed Yoni rules
    await this.seedYoniRules();
    
    // Seed Graha Maitri rules
    await this.seedGrahaMaitriRules();
    
    // Seed Gana rules
    await this.seedGanaRules();
    
    // Seed Bhakoot rules
    await this.seedBhakootRules();
    
    // Seed Nadi rules
    await this.seedNadiRules();

    console.log('✅ Koota rules seeded successfully');
  }

  private async seedVarnaRules(): Promise<void> {
    const varnaRules = [
      { id: 1, personAGender: 'MALE' as const, personBGender: 'FEMALE' as const, score: 1 },
      { id: 2, personAGender: 'FEMALE' as const, personBGender: 'MALE' as const, score: 1 },
      { id: 3, personAGender: 'MALE' as const, personBGender: 'MALE' as const, score: 0 },
      { id: 4, personAGender: 'FEMALE' as const, personBGender: 'FEMALE' as const, score: 0 },
    ];

    for (const rule of varnaRules) {
      await this.prisma.varnaRule.upsert({
        where: { id: rule.id },
        update: rule,
        create: rule,
      });
    }
  }

  private async seedVashyaRules(): Promise<void> {
    const vashyaRules = [
      { id: 1, personARashi: 'Aries', personBRashi: 'Aries', score: 2 },
      { id: 2, personARashi: 'Taurus', personBRashi: 'Taurus', score: 2 },
      { id: 3, personARashi: 'Gemini', personBRashi: 'Gemini', score: 2 },
      { id: 4, personARashi: 'Cancer', personBRashi: 'Cancer', score: 2 },
      { id: 5, personARashi: 'Leo', personBRashi: 'Leo', score: 2 },
      { id: 6, personARashi: 'Virgo', personBRashi: 'Virgo', score: 2 },
      { id: 7, personARashi: 'Libra', personBRashi: 'Libra', score: 2 },
      { id: 8, personARashi: 'Scorpio', personBRashi: 'Scorpio', score: 2 },
      { id: 9, personARashi: 'Sagittarius', personBRashi: 'Sagittarius', score: 2 },
      { id: 10, personARashi: 'Capricorn', personBRashi: 'Capricorn', score: 2 },
      { id: 11, personARashi: 'Aquarius', personBRashi: 'Aquarius', score: 2 },
      { id: 12, personARashi: 'Pisces', personBRashi: 'Pisces', score: 2 },
    ];

    for (const rule of vashyaRules) {
      await this.prisma.vashyaRule.upsert({
        where: { id: rule.id },
        update: rule,
        create: rule,
      });
    }
  }

  private async seedTaraRules(): Promise<void> {
    const taraRules = [
      { id: 1, personANakshatra: 'Ashwini', personBNakshatra: 'Ashwini', score: 3 },
      { id: 2, personANakshatra: 'Bharani', personBNakshatra: 'Bharani', score: 3 },
      { id: 3, personANakshatra: 'Krittika', personBNakshatra: 'Krittika', score: 3 },
      // Add more rules as needed
    ];

    for (const rule of taraRules) {
      await this.prisma.taraRule.upsert({
        where: { id: rule.id },
        update: rule,
        create: rule,
      });
    }
  }

  private async seedYoniRules(): Promise<void> {
    const yoniRules = [
      { id: 1, personANakshatra: 'Ashwini', personBNakshatra: 'Ashwini', score: 4 },
      { id: 2, personANakshatra: 'Bharani', personBNakshatra: 'Bharani', score: 4 },
      { id: 3, personANakshatra: 'Krittika', personBNakshatra: 'Krittika', score: 4 },
      // Add more rules as needed
    ];

    for (const rule of yoniRules) {
      await this.prisma.yoniRule.upsert({
        where: { id: rule.id },
        update: rule,
        create: rule,
      });
    }
  }

  private async seedGrahaMaitriRules(): Promise<void> {
    const grahaMaitriRules = [
      { id: 1, personARashi: 'Aries', personBRashi: 'Aries', score: 5 },
      { id: 2, personARashi: 'Taurus', personBRashi: 'Taurus', score: 5 },
      { id: 3, personARashi: 'Gemini', personBRashi: 'Gemini', score: 5 },
      // Add more rules as needed
    ];

    for (const rule of grahaMaitriRules) {
      await this.prisma.grahaMaitriRule.upsert({
        where: { id: rule.id },
        update: rule,
        create: rule,
      });
    }
  }

  private async seedGanaRules(): Promise<void> {
    const ganaRules = [
      { id: 1, personANakshatra: 'Ashwini', personBNakshatra: 'Ashwini', score: 6 },
      { id: 2, personANakshatra: 'Bharani', personBNakshatra: 'Bharani', score: 6 },
      { id: 3, personANakshatra: 'Krittika', personBNakshatra: 'Krittika', score: 6 },
      // Add more rules as needed
    ];

    for (const rule of ganaRules) {
      await this.prisma.ganaRule.upsert({
        where: { id: rule.id },
        update: rule,
        create: rule,
      });
    }
  }

  private async seedBhakootRules(): Promise<void> {
    const bhakootRules = [
      { id: 1, personARashi: 'Aries', personBRashi: 'Taurus', score: 7 },
      { id: 2, personARashi: 'Taurus', personBRashi: 'Gemini', score: 7 },
      { id: 3, personARashi: 'Gemini', personBRashi: 'Cancer', score: 7 },
      // Add more rules as needed
    ];

    for (const rule of bhakootRules) {
      await this.prisma.bhakootRule.upsert({
        where: { id: rule.id },
        update: rule,
        create: rule,
      });
    }
  }

  private async seedNadiRules(): Promise<void> {
    const nadiRules = [
      { id: 1, personANakshatra: 'Ashwini', personBNakshatra: 'Revati', score: 8 },
      { id: 2, personANakshatra: 'Bharani', personBNakshatra: 'Ashwini', score: 8 },
      { id: 3, personANakshatra: 'Krittika', personBNakshatra: 'Bharani', score: 8 },
      // Add more rules as needed
    ];

    for (const rule of nadiRules) {
      await this.prisma.nadiRule.upsert({
        where: { id: rule.id },
        update: rule,
        create: rule,
      });
    }
  }

  /**
   * Seed sample users for testing
   */
  async seedSampleUsers(): Promise<void> {
    console.log('🌱 Seeding sample users...');

    const sampleUsers = [
      {
        name: 'John Doe',
        gender: 'MALE' as const,
        dateOfBirth: new Date('1990-05-15'),
        timeOfBirth: new Date('1990-05-15T10:30:00'),
        placeOfBirth: 'New York, USA',
        latitude: 40.7128,
        longitude: -74.0060,
        timezone: 'America/New_York'
      },
      {
        name: 'Jane Smith',
        gender: 'FEMALE' as const,
        dateOfBirth: new Date('1992-08-20'),
        timeOfBirth: new Date('1992-08-20T14:45:00'),
        placeOfBirth: 'Los Angeles, USA',
        latitude: 34.0522,
        longitude: -118.2437,
        timezone: 'America/Los_Angeles'
      }
    ];

    for (const user of sampleUsers) {
      // Check if user already exists
      const existingUser = await this.prisma.user.findFirst({
        where: { name: user.name }
      });
      
      if (!existingUser) {
        await this.prisma.user.create({
          data: user
        });
      }
    }

    console.log('✅ Sample users seeded successfully');
  }

  /**
   * Run all seed operations
   */
  async runSeeds(): Promise<void> {
    try {
      await this.seedKootaRules();
      await this.seedSampleUsers();
      console.log('🎉 All seeds completed successfully!');
    } catch (error) {
      console.error('❌ Seeding failed:', error);
      throw error;
    }
  }
}
