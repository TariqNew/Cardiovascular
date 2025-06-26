const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');
const aiService = require('../services/ai.service');

const prisma = new PrismaClient();

class MealController {
  async logMeal(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { mealType, foodItems, calories, date } = req.body;

      const meal = await prisma.mealLog.create({
        data: {
          userId: req.user.userId,
          mealType,
          foodItems,
          calories,
          date: date ? new Date(date) : new Date()
        }
      });

      res.status(201).json(meal);
    } catch (error) {
      console.error('Log meal error:', error);
      res.status(500).json({ message: 'Error logging meal' });
    }
  }

  async getMealHistory(req, res) {
    try {
      const { days = 7, mealType } = req.query;

      const whereClause = {
        userId: req.user.userId,
        date: {
          gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
        }
      };

      if (mealType) {
        whereClause.mealType = mealType.toUpperCase();
      }

      const meals = await prisma.mealLog.findMany({
        where: whereClause,
        orderBy: {
          date: 'desc'
        }
      });

      res.json(meals);
    } catch (error) {
      console.error('Get meal history error:', error);
      res.status(500).json({ message: 'Error fetching meal history' });
    }
  }

  async getDailyMealPlan(req, res) {
    try {
      const healthProfile = await prisma.healthProfile.findUnique({
        where: { userId: req.user.userId }
      });

      if (!healthProfile) {
        return res.status(404).json({ message: 'Health profile not found' });
      }

      const mealTypes = ['BREAKFAST', 'LUNCH', 'DINNER'];
      const mealPlan = {};

      for (const mealType of mealTypes) {
        const recommendation = await aiService.generateDietRecommendation(
          healthProfile,
          mealType
        );

        mealPlan[mealType.toLowerCase()] = recommendation;
      }

      // Store the meal plan
      const mealLogs = await prisma.mealLog.createMany({
        data: Object.entries(mealPlan).map(([type, recommendation]) => ({
          userId: req.user.userId,
          mealType: type.toUpperCase(),
          foodItems: [recommendation],
          calories: 0,
          date: new Date()
        }))
      });

      res.json({
        date: new Date(),
        meals: mealPlan
      });
    } catch (error) {
      console.error('Get daily meal plan error:', error);
      res.status(500).json({ message: 'Error generating meal plan' });
    }
  }

  async getWeeklyMealPlan(req, res) {
    try {
      const healthProfile = await prisma.healthProfile.findUnique({
        where: { userId: req.user.userId }
      });

      if (!healthProfile) {
        return res.status(404).json({ message: 'Health profile not found' });
      }

      const weeklyPlan = {};
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const mealTypes = ['BREAKFAST', 'LUNCH', 'DINNER'];

      for (const day of days) {
        weeklyPlan[day] = {};
        for (const mealType of mealTypes) {
          const recommendation = await aiService.generateDietRecommendation(
            healthProfile,
            mealType,
            day // Pass the day to make recommendations more varied
          );
          weeklyPlan[day][mealType.toLowerCase()] = recommendation;
        }
      }

      res.json({
        generatedAt: new Date(),
        weeklyPlan
      });
    } catch (error) {
      console.error('Get weekly meal plan error:', error);
      res.status(500).json({ message: 'Error generating weekly meal plan' });
    }
  }

  async analyzeMealHistory(req, res) {
    try {
      const { days = 30 } = req.query;

      const mealLogs = await prisma.mealLog.findMany({
        where: {
          userId: req.user.userId,
          date: {
            gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
          }
        },
        orderBy: {
          date: 'desc'
        }
      });

      if (mealLogs.length === 0) {
        return res.status(404).json({ message: 'No meal logs found for analysis' });
      }

      // Get health profile for context
      const healthProfile = await prisma.healthProfile.findUnique({
        where: { userId: req.user.userId }
      });

      // Use AI to analyze meal patterns and provide insights
      const analysis = await aiService.analyzeMealHistory(mealLogs, healthProfile);

      res.json({
        analysis,
        totalMeals: mealLogs.length,
        periodDays: days
      });
    } catch (error) {
      console.error('Analyze meal history error:', error);
      res.status(500).json({ message: 'Error analyzing meal history' });
    }
  }
}

module.exports = new MealController(); 