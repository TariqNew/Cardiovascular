const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Global setup - runs once before all tests
beforeAll(async () => {
  // Create test database and apply migrations
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
  await prisma.$connect();
});

// Global teardown - runs once after all tests
afterAll(async () => {
  await prisma.$disconnect();
});

// Reset database before each test
beforeEach(async () => {
  const tablenames = await prisma.$queryRaw
    `SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  for (const { tablename } of tablenames) {
    if (tablename !== '_prisma_migrations') {
      try {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" CASCADE;`);
      } catch (error) {
        console.log({ error });
      }
    }
  }
});

// Test utilities
global.createTestUser = async (overrides = {}) => {
  const defaultUser = {
    email: 'test@example.com',
    password: await bcrypt.hash('password123', 10),
    firstName: 'Test',
    lastName: 'User',
    isActive: true
  };

  const user = await prisma.user.create({
    data: {
      ...defaultUser,
      ...overrides
    }
  });

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1d' }
  );

  return { user, token };
};

global.createTestHealthProfile = async (userId, overrides = {}) => {
  const defaultProfile = {
    age: 45,
    weight: 75.5,
    height: 175,
    bloodPressure: '120/80',
    cholesterolLevel: 180,
    bmi: 24.6,
    medicalConditions: ['Hypertension'],
    allergies: ['None'],
    medications: ['Lisinopril'],
    targetWeight: 72,
    dietaryRestrictions: ['Low Sodium'],
    activityLevel: 'MODERATE'
  };

  return prisma.healthProfile.create({
    data: {
      userId,
      ...defaultProfile,
      ...overrides
    }
  });
};

global.createTestMealLog = async (userId, overrides = {}) => {
  const defaultMeal = {
    mealType: 'BREAKFAST',
    foodItems: ['Oatmeal', 'Banana'],
    calories: 350,
    proteins: 12,
    carbs: 65,
    fats: 8,
    fiber: 6,
    sodium: 120,
    date: new Date(),
    rating: 4
  };

  return prisma.mealLog.create({
    data: {
      userId,
      ...defaultMeal,
      ...overrides
    }
  });
};

global.createTestHealthLog = async (userId, overrides = {}) => {
  const defaultLog = {
    weight: 75.5,
    bloodPressure: '120/80',
    heartRate: 72,
    stress: 'LOW',
    sleep: 8,
    symptoms: ['None'],
    notes: 'Feeling good',
    date: new Date()
  };

  return prisma.healthLog.create({
    data: {
      userId,
      ...defaultLog,
      ...overrides
    }
  });
};

// Make prisma available globally in tests
global.prisma = prisma; 