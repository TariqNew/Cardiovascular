const express = require('express');
const NotificationController = require('../controllers/notification.controller');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// Instantiate the controller
const notificationController = new NotificationController();

// Bind the correct method as the route handler
router.get('/notification', notificationController.getNotifications.bind(notificationController));

module.exports = router;
