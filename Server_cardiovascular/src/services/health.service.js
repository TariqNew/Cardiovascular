const { PrismaClient } = require('@prisma/client');
const aiService = require('./ai.service');
const parseFile = require('./Parse'); 

const prisma = new PrismaClient();

async function generateHealthTipsForUser(userId) {
  const profile = await prisma.healthProfile.findUnique({ where: { userId } });
  if (!profile) throw new Error(`No profile found for user ${userId}`);

  const fileText = await parseFile(); // Replace with actual input
  const tips = await aiService.generateHealthRecommendation(fileText);

  await prisma.healthLog.create({
    data: {
      userId,
      notes: tips,
      date: new Date(),
    },
  });

  await prisma.notification.create({
    data: {
      userId,
      title: "New health tips available",
      description: "Your personalized health tips have been updated.",
      type: "HEALTH_TIP",
      time: new Date(),
    },
  });

  return tips;
}

async function generateMealPlanForUser(userId) {
  const profile = await prisma.healthProfile.findUnique({ where: { userId } });
  if (!profile) throw new Error(`No profile found for user ${userId}`);

  const meals = {};
  for (const type of ['BREAKFAST', 'LUNCH', 'DINNER']) {
    meals[type] = await aiService.generateDietRecommendation(profile, type);
  }

  await prisma.mealLog.createMany({
    data: Object.entries(meals).map(([mealType, foodItems]) => ({
      userId,
      mealType,
      foodItems: [foodItems],
      calories: 0,
      date: new Date(),
    })),
  });

  await prisma.notification.create({
    data: {
      userId,
      title: "New meal plan available",
      description: "Your meal plan for today has been generated.",
      type: "MEAL_PLAN",
      time: new Date(),
    },
  });

  return meals;
}

module.exports = {
  generateHealthTipsForUser,
  generateMealPlanForUser,
};
