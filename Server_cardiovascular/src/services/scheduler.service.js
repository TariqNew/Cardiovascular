const schedule = require('node-schedule');
const { PrismaClient } = require('@prisma/client');
const aiService = require('./ai.service');

const prisma = new PrismaClient();

class SchedulerService {
  constructor() {
    this.initializeSchedules();
  }

  initializeSchedules() {
    // Schedule health tips every 6 hours
    schedule.scheduleJob('0 */6 * * *', async () => {
      try {
        await this.sendHealthTipsToAllUsers();
      } catch (error) {
        console.error('Error in scheduled health tips:', error);
      }
    });

    // Schedule daily meal recommendations at 5 AM
    schedule.scheduleJob('0 5 * * *', async () => {
      try {
        await this.generateDailyMealPlans();
      } catch (error) {
        console.error('Error in scheduled meal plans:', error);
      }
    });
  }

  async sendHealthTipsToAllUsers() {
    try {
      // Get all users with health profiles
      const healthProfiles = await prisma.healthProfile.findMany({
        include: {
          user: true
        }
      });

      for (const profile of healthProfiles) {
        try {
          const tips = await aiService.generateHealthTips(profile);
          
          // Store the tips in the health log
          await prisma.healthLog.create({
            data: {
              userId: profile.userId,
              notes: tips,
              date: new Date()
            }
          });

          // Here you would typically send these tips to the user
          // through a notification system or email service
          console.log(`Generated health tips for user ${profile.userId}`);
        } catch (error) {
          console.error(`Error generating tips for user ${profile.userId}:`, error);
        }
      }
    } catch (error) {
      console.error('Error in sendHealthTipsToAllUsers:', error);
      throw error;
    }
  }

  async generateDailyMealPlans() {
    try {
      // Get all users with health profiles
      const healthProfiles = await prisma.healthProfile.findMany({
        include: {
          user: true
        }
      });

      for (const profile of healthProfiles) {
        try {
          const meals = {};
          // Generate recommendations for all meal types
          for (const mealType of ['BREAKFAST', 'LUNCH', 'DINNER']) {
            meals[mealType] = await aiService.generateDietRecommendation(profile, mealType);
          }

          // Store the meal recommendations
          await prisma.mealLog.createMany({
            data: Object.entries(meals).map(([type, recommendation]) => ({
              userId: profile.userId,
              mealType: type,
              foodItems: [recommendation],
              calories: 0, // This would need to be parsed from the AI response
              date: new Date()
            }))
          });

          console.log(`Generated meal plan for user ${profile.userId}`);
        } catch (error) {
          console.error(`Error generating meal plan for user ${profile.userId}:`, error);
        }
      }
    } catch (error) {
      console.error('Error in generateDailyMealPlans:', error);
      throw error;
    }
  }
}

module.exports = new SchedulerService(); 