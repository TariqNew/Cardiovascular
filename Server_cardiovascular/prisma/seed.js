const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🌱 Starting database seeding...');

    // Create test users
    const testUsers = [
      {
        email: 'john.doe@example.com',
        password: await bcrypt.hash('password123', 10),
        firstName: 'John',
        lastName: 'Doe'
      },
      {
        email: 'jane.smith@example.com',
        password: await bcrypt.hash('password123', 10),
        firstName: 'Jane',
        lastName: 'Smith'
      }
    ];

    console.log('👤 Creating test users...');
    for (const userData of testUsers) {
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: {
          ...userData,
          isActive: true,
          lastLogin: new Date(),
          preferences: {
            create: {
              reminderTime: new Date().setHours(9, 0, 0, 0),
              mealPlanFrequency: 'DAILY',
              emailNotifications: true,
              pushNotifications: true,
              theme: 'LIGHT',
              language: 'en'
            }
          }
        }
      });

      // Create health profile for each user
      console.log(`📋 Creating health profile for ${userData.firstName}...`);
      await prisma.healthProfile.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          age: 45,
          weight: 75.5,
          height: 175,
          bloodPressure: '120/80',
          cholesterolLevel: 180,
          bmi: 24.6,
          medicalConditions: ['Hypertension', 'High Cholesterol'],
          allergies: ['Shellfish'],
          medications: ['Lisinopril', 'Statins'],
          targetWeight: 72,
          dietaryRestrictions: ['Low Sodium', 'Low Fat'],
          activityLevel: 'MODERATE'
        }
      });

      // Create sample meal logs
      console.log(`🍽️ Creating meal logs for ${userData.firstName}...`);
      const mealTypes = ['BREAKFAST', 'LUNCH', 'DINNER'];
      const today = new Date();

      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        for (const mealType of mealTypes) {
          await prisma.mealLog.create({
            data: {
              userId: user.id,
              mealType,
              foodItems: getMockFoodItems(mealType),
              calories: Math.floor(Math.random() * 300) + 300,
              proteins: Math.floor(Math.random() * 30) + 20,
              carbs: Math.floor(Math.random() * 40) + 30,
              fats: Math.floor(Math.random() * 20) + 10,
              fiber: Math.floor(Math.random() * 10) + 5,
              sodium: Math.floor(Math.random() * 500) + 200,
              date,
              rating: Math.floor(Math.random() * 5) + 1,
              isAIGenerated: Math.random() > 0.5
            }
          });
        }
      }

      // Create sample health logs
      console.log(`📊 Creating health logs for ${userData.firstName}...`);
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        await prisma.healthLog.create({
          data: {
            userId: user.id,
            weight: 75.5 - (Math.random() * 0.5),
            bloodPressure: '120/80',
            heartRate: Math.floor(Math.random() * 10) + 65,
            stress: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)],
            sleep: Math.floor(Math.random() * 3) + 6,
            symptoms: getRandomSymptoms(),
            notes: 'Daily health check',
            date
          }
        });
      }
    }

    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

function getMockFoodItems(mealType) {
  const meals = {
    BREAKFAST: ['Oatmeal', 'Banana', 'Almonds', 'Green Tea'],
    LUNCH: ['Grilled Chicken', 'Brown Rice', 'Steamed Broccoli', 'Olive Oil'],
    DINNER: ['Baked Salmon', 'Quinoa', 'Roasted Vegetables', 'Lemon Dressing']
  };
  return meals[mealType];
}

function getRandomSymptoms() {
  const allSymptoms = ['Fatigue', 'Headache', 'Dizziness', 'Chest Pain', 'Shortness of Breath'];
  return allSymptoms.filter(() => Math.random() > 0.7);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 