const schedule = require('node-schedule');
const { PrismaClient } = require('@prisma/client');
const {
  generateHealthTipsForUser,
  generateMealPlanForUser,
} = require('./health.service');

const prisma = new PrismaClient();

class SchedulerService {
  constructor() {
    this.initializeSchedules();
  }

  initializeSchedules() {
    // Every 6 hours - health tips
    schedule.scheduleJob('0 */6 * * *', async () => {
      try {
        const users = await prisma.user.findMany();
        for (const user of users) {
          try {
            await generateHealthTipsForUser(user.id);
            console.log(`Health tips generated for user ${user.id}`);
          } catch (err) {
            console.error(`Failed for user ${user.id}:`, err.message);
          }
        }
      } catch (error) {
        console.error('Scheduler Error - Health Tips:', error);
      }
    });

    // Daily at 5am - meal plans
    schedule.scheduleJob('0 5 * * *', async () => {
      try {
        const users = await prisma.user.findMany();
        for (const user of users) {
          try {
            await generateMealPlanForUser(user.id);
            console.log(`Meal plan generated for user ${user.id}`);
          } catch (err) {
            console.error(`Failed for user ${user.id}:`, err.message);
          }
        }
      } catch (error) {
        console.error('Scheduler Error - Meal Plans:', error);
      }
    });
  }
}

module.exports = new SchedulerService();
