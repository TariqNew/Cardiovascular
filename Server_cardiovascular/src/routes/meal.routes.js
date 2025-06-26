const express = require('express');
const { body, query } = require('express-validator');
const router = express.Router();
const mealController = require('../controllers/meal.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// Meal log validation
const mealLogValidation = [
  body('mealType')
    .isIn(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'])
    .withMessage('Invalid meal type'),
  body('foodItems')
    .isArray()
    .withMessage('Food items must be an array'),
  body('calories')
    .isFloat({ min: 0 })
    .withMessage('Calories must be a positive number'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format')
];

// Query validation
const historyQueryValidation = [
  query('days')
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage('Days must be between 1 and 365'),
  query('mealType')
    .optional()
    .isIn(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'])
    .withMessage('Invalid meal type')
];

// Routes
router.post('/log', mealLogValidation, mealController.logMeal);
router.get('/history', historyQueryValidation, mealController.getMealHistory);
router.get('/plan/daily', mealController.getDailyMealPlan);
router.get('/plan/weekly', mealController.getWeeklyMealPlan);
router.get('/analysis', historyQueryValidation, mealController.analyzeMealHistory);

module.exports = router; 