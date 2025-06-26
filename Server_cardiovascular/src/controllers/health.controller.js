const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');

const prisma = new PrismaClient();

class HealthController {
  async createOrUpdateHealthProfile(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        age,
        weight,
        height,
        bloodPressure,
        cholesterolLevel,
        medicalConditions,
        allergies
      } = req.body;

      // Calculate BMI
      const heightInMeters = height / 100; // Convert cm to meters
      const bmi = weight / (heightInMeters * heightInMeters);

      const healthProfile = await prisma.healthProfile.upsert({
        where: {
          userId: req.user.userId
        },
        update: {
          age,
          weight,
          height,
          bloodPressure,
          cholesterolLevel,
          bmi,
          medicalConditions,
          allergies
        },
        create: {
          userId: req.user.userId,
          age,
          weight,
          height,
          bloodPressure,
          cholesterolLevel,
          bmi,
          medicalConditions,
          allergies
        }
      });

      res.json(healthProfile);
    } catch (error) {
      console.error('Health profile update error:', error);
      res.status(500).json({ message: 'Error updating health profile' });
    }
  }

  async getHealthProfile(req, res) {
    try {
      const healthProfile = await prisma.healthProfile.findUnique({
        where: {
          userId: req.user.userId
        }
      });

      if (!healthProfile) {
        return res.status(404).json({ message: 'Health profile not found' });
      }

      res.json(healthProfile);
    } catch (error) {
      console.error('Get health profile error:', error);
      res.status(500).json({ message: 'Error fetching health profile' });
    }
  }

  async addHealthLog(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { weight, bloodPressure, notes } = req.body;

      const healthLog = await prisma.healthLog.create({
        data: {
          userId: req.user.userId,
          weight,
          bloodPressure,
          notes,
          date: new Date()
        }
      });

      res.status(201).json(healthLog);
    } catch (error) {
      console.error('Add health log error:', error);
      res.status(500).json({ message: 'Error adding health log' });
    }
  }

  async getHealthLogs(req, res) {
    try {
      const { days = 30 } = req.query;

      const healthLogs = await prisma.healthLog.findMany({
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

      res.json(healthLogs);
    } catch (error) {
      console.error('Get health logs error:', error);
      res.status(500).json({ message: 'Error fetching health logs' });
    }
  }
}

module.exports = new HealthController(); 