const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendation.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// Get meal recommendation
router.get('/diet', recommendationController.getDietRecommendation);

// Get health analysis
router.get('/analysis', recommendationController.getHealthAnalysis);

// Get health tips
router.get('/tips', recommendationController.getHealthTips);

// Schedule daily meals
router.post('/schedule-meals', recommendationController.scheduleDailyMeals);

// Image fetch route
router.get('/image-proxy', recommendationController.imageProxy);

// Schedule daily meals
router.get('/docs', recommendationController.getHealthRecommendations);


module.exports = router; 