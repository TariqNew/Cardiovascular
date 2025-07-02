const express = require('express');
const cors = require('cors')
const { PrismaClient } = require('@prisma/client');
const authRoutes = require('./routes/auth.routes');
const healthRoutes = require('./routes/health.routes');
const mealRoutes = require('./routes/meal.routes');
const recommendationRoutes = require('./routes/recommendation.routes');
const notificationRoutes = require('./routes/notification.routes');
const schedulerService = require('./services/scheduler.service');

const dotenv = require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Initialize scheduler service
schedulerService;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/notifications', notificationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 