const { PrismaClient } = require("@prisma/client");
const { validationResult } = require("express-validator");

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
        allergies,
      } = req.body;

      const userId = req.user.userId;

      // Calculate BMI
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);

      // Upsert the health profile
      const healthProfile = await prisma.healthProfile.upsert({
        where: {
          userId,
        },
        update: {
          age,
          weight,
          height,
          bloodPressure,
          cholesterolLevel,
          bmi,
          medicalConditions,
          allergies,
        },
        create: {
          userId,
          age,
          weight,
          height,
          bloodPressure,
          cholesterolLevel,
          bmi,
          medicalConditions,
          allergies,
        },
      });

      // Automatically log health snapshot for trend tracking
      await prisma.healthLog.create({
        data: {
          userId,
          weight,
          bloodPressure,
          cholesterol: cholesterolLevel,
          bmi,
          date: new Date(),
          notes: "Auto-log from profile update",
        },
      });

      res.json(healthProfile);
    } catch (error) {
      console.error("Health profile update error:", error);
      res.status(500).json({ message: "Error updating health profile" });
    }
  }

  async getHealthProfile(req, res) {
    try {
      const healthProfile = await prisma.healthProfile.findUnique({
        where: {
          userId: req.user.userId,
        },
      });

      if (!healthProfile) {
        return res.status(404).json({ message: "Health profile not found" });
      }

      res.json(healthProfile);
    } catch (error) {
      console.error("Get health profile error:", error);
      res.status(500).json({ message: "Error fetching health profile" });
    }
  }

  // health.controller.js

  async getGraphData(req, res) {
    try {
      const { userId } = req.user;
      const { days = 30 } = req.query;

      const logs = await prisma.healthLog.findMany({
        where: {
          userId,
          date: {
            gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000), // last X days
          },
        },
        orderBy: {
          date: "asc",
        },
      });

      const graphData = {
        dates: logs.map((log) => log.date.toISOString().split("T")[0]),
        weight: logs.map((log) => log.weight),
        bmi: logs.map((log) => log.bmi || null),
        cholesterol: {
          total: logs.map((log) => log.cholesterol || null),
          ldl: logs.map(() => null), // Placeholder if not tracked separately
          hdl: logs.map(() => null),
        },
        bloodPressure: {
          systolic: logs.map((log) => {
            const [systolic] = log.bloodPressure.split("/").map(Number);
            return systolic || null;
          }),
          diastolic: logs.map((log) => {
            const [, diastolic] = log.bloodPressure.split("/").map(Number);
            return diastolic || null;
          }),
        },
      };

      res.json(graphData);
    } catch (error) {
      console.error("Graph data fetch error:", error);
      res.status(500).json({ message: "Failed to fetch graph data" });
    }
  }
}

module.exports = new HealthController();
