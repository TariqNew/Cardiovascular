const { PrismaClient } = require("@prisma/client");
const aiService = require("../services/ai.service");
const prisma = new PrismaClient();

class RecommendationController {
  async getDietRecommendation(req, res) {
    try {
      const { userId } = req.user;

      const healthProfile = await prisma.healthProfile.findUnique({
        where: { userId },
      });

      if (!healthProfile) {
        return res.status(404).json({ message: "Health profile not found" });
      }

      const aiResponse =
        await aiService.generateDietRecommendation(healthProfile);
      const rawText = aiResponse;
      if (!rawText) throw new Error("No 'recommendation' returned from AI");

      const extractMeal = (label, text) => {
        const sectionRegex = new RegExp(
          `### \\d+\\. ${label}:([\\s\\S]*?)(?=### \\d+\\.|$)`,
          "i"
        );
        const match = text.match(sectionRegex);
        if (!match) return null;

        const section = match[1].trim();
        const lines = section
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);

        const title = lines[0] || "N/A";

        // Nutritional values
        const nutritionBlock =
          section.match(
            /\*\*Nutritional Information.*?\*\*([\s\S]*?)\n\n/i
          )?.[1] || "";
        const extractValue = (label) => {
          const match = nutritionBlock.match(
            new RegExp(`-\\s*${label}:\\s*([\\d.]+\\s*\\w*)`, "i")
          );
          return match?.[1] || "N/A";
        };

        const calories = extractValue("Calories");
        const protein = extractValue("Protein");
        const carbohydrates = extractValue("Carbohydrates");
        const fiber = extractValue("Fiber");
        const fats = extractValue("Healthy Fats");

        const whyBeneficialMatch = section.match(
          /\*\*Why the Meal is Beneficial:\*\*([\s\S]*?)(?=\*\*|$)/i
        );
        const whyBeneficial = whyBeneficialMatch?.[1]?.trim() || "N/A";

        const instructionsMatch = section.match(
          /\*\*Cooking Instructions or Preparation Tips:\*\*([\s\S]*)/i
        );
        const instructions = instructionsMatch
          ? instructionsMatch[1]
              .trim()
              .split("\n")
              .map((line) => line.replace(/^\d+\.\s*/, "").trim())
          : [];

        return {
          title,
          preparationTime: "10-15 mins", // You can make this dynamic if needed
          calories,
          nutritionalContents: {
            protein,
            carbohydrates,
            fiber,
            healthyFats: fats,
          },
          whyBeneficial,
          instructions,
          fullSection: section,
        };
      };

      const breakfast = extractMeal("Breakfast", rawText);
      const lunch = extractMeal("Lunch", rawText);
      const dinner = extractMeal("Dinner", rawText);

      res.json({
        breakfast,
        lunch,
        dinner,
        fullText: rawText,
      });
    } catch (error) {
      console.error("Error in getDietRecommendation:", error);
      res.status(500).json({
        message: "Failed to get diet recommendation",
        error: error.message,
      });
    }
  }

  async getHealthAnalysis(req, res) {
    try {
      const { userId } = req.user;
      const { days = 30 } = req.query;

      // Get user's health logs for the specified period
      const healthLogs = await prisma.healthLog.findMany({
        where: {
          userId,
          date: {
            gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
          },
        },
        orderBy: {
          date: "desc",
        },
      });

      if (healthLogs.length === 0) {
        return res
          .status(404)
          .json({ message: "No health logs found for analysis" });
      }

      // Generate AI analysis
      const analysis = await aiService.analyzeHealthTrends(healthLogs);

      res.json({ analysis });
    } catch (error) {
      console.error("Error in getHealthAnalysis:", error);
      res.status(500).json({ message: "Failed to get health analysis" });
    }
  }

  async getHealthTips(req, res) {
    try {
      const { userId } = req.user;

      // Get user's health profile
      const healthProfile = await prisma.healthProfile.findUnique({
        where: { userId },
      });

      if (!healthProfile) {
        return res.status(404).json({ message: "Health profile not found" });
      }

      // Generate AI health tips
      const tips = await aiService.generateHealthTips(healthProfile);

      res.json({ tips });
    } catch (error) {
      console.error("Error in getHealthTips:", error);
      res.status(500).json({ message: "Failed to get health tips" });
    }
  }

  async scheduleDailyMeals(req, res) {
    try {
      const { userId } = req.user;
      const healthProfile = await prisma.healthProfile.findUnique({
        where: { userId },
      });

      if (!healthProfile) {
        return res.status(404).json({ message: "Health profile not found" });
      }

      // Generate recommendations for all meal types
      const meals = {};
      for (const mealType of ["BREAKFAST", "LUNCH", "DINNER"]) {
        meals[mealType.toLowerCase()] =
          await aiService.generateDietRecommendation(healthProfile, mealType);
      }

      // Store the meal recommendations
      await prisma.mealLog.createMany({
        data: Object.entries(meals).map(([type, recommendation]) => ({
          userId,
          mealType: type.toUpperCase(),
          foodItems: [recommendation], // Store the AI recommendation
          calories: 0, // This would need to be parsed from the AI response if needed
          date: new Date(),
        })),
      });

      res.json({ meals });
    } catch (error) {
      console.error("Error in scheduleDailyMeals:", error);
      res.status(500).json({ message: "Failed to schedule daily meals" });
    }
  }
}

module.exports = new RecommendationController();
