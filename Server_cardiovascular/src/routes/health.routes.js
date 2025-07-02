const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const healthController = require('../controllers/health.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// Health profile validation
const healthProfileValidation = [
  body('age').isInt({ min: 0 }).withMessage('Age must be a positive number'),
  body('weight').isFloat({ min: 0 }).withMessage('Weight must be a positive number'),
  body('height').isFloat({ min: 0 }).withMessage('Height must be a positive number'),
  body('bloodPressure').notEmpty().withMessage('Blood pressure is required'),
  body('cholesterolLevel').isFloat({ min: 0 }).withMessage('Cholesterol level must be a positive number'),
  body('medicalConditions').isArray().withMessage('Medical conditions must be an array'),
  body('allergies').isArray().withMessage('Allergies must be an array')
];

// Health log validation
const healthLogValidation = [
  body('weight').optional().isFloat({ min: 0 }).withMessage('Weight must be a positive number'),
  body('bloodPressure').optional().notEmpty().withMessage('Blood pressure must not be empty if provided'),
  body('notes').optional().isString().withMessage('Notes must be a string')
];

// Health profile routes
router.post('/profile', healthProfileValidation, healthController.createOrUpdateHealthProfile);
router.get('/profile', healthController.getHealthProfile);

// Health logs routes
router.get('/logs', healthController.getGraphData);

module.exports = router; 