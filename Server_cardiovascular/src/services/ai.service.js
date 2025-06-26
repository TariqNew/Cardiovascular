const dotenv = require("dotenv").config();
const OpenAI = require("openai");

const openai = new OpenAI(process.env.OPENAI_API_KEY);

class AIService {
  async generateDietRecommendation(healthProfile, day = null) {
    try {
      const prompt = this.createDietPrompt(healthProfile, day);
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a specialized nutritionist and dietitian for cardiovascular patients. Provide specific, healthy meal recommendations based on the patient's health profile.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error("Error generating diet recommendation:", error);
      throw new Error("Failed to generate diet recommendation");
    }
  }

  async analyzeHealthTrends(healthLogs) {
    try {
      const prompt = this.createHealthAnalysisPrompt(healthLogs);
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a cardiovascular health analyst. Analyze the patient's health trends and provide insights and recommendations.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error("Error analyzing health trends:", error);
      throw new Error("Failed to analyze health trends");
    }
  }

  async generateHealthTips(healthProfile) {
    try {
      const prompt = this.createHealthTipsPrompt(healthProfile);
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a cardiovascular health expert. Provide personalized health tips based on the patient's profile.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 300,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error("Error generating health tips:", error);
      throw new Error("Failed to generate health tips");
    }
  }

  async analyzeMealHistory(mealLogs, healthProfile) {
    try {
      const prompt = this.createMealAnalysisPrompt(mealLogs, healthProfile);
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a nutritionist specializing in cardiovascular health. Analyze the patient's meal history and provide detailed insights and recommendations.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 800,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error("Error analyzing meal history:", error);
      throw new Error("Failed to analyze meal history");
    }
  }

  createDietPrompt(healthProfile, day = null) {
    const dayContext = day ? `for ${day}` : "";
    return `Please suggest a healthy ${dayContext} for a cardiovascular patient with the following profile:
    - Age: ${healthProfile.age}
    - Weight: ${healthProfile.weight} kg
    - BMI: ${healthProfile.bmi}
    - Blood Pressure: ${healthProfile.bloodPressure}
    - Cholesterol Level: ${healthProfile.cholesterolLevel}
    - Medical Conditions: ${healthProfile.medicalConditions.join(", ")}
    - Allergies: ${healthProfile.allergies.join(", ")}

    Based in Tanzania please provide:
    1. Breakfast
      - provide the title of the breakfast
      - nutritional information
      - Why meal is beneficial for their condition
      - Cooking Instructions or preparations tips
    2. Lunch
      - provide the title of the Lunch
      - nutritional information
      - Why meal is beneficial for their condition
      - Cooking Instructions or preparations tips
    3. Dinner
      - provide the title of the Dinner
      - nutritional information
      - Why meal is beneficial for their condition
      - Cooking Instructions or preparations tips`;
  }

  createHealthAnalysisPrompt(healthLogs) {
    const logsString = healthLogs
      .map(
        (log) =>
          `Date: ${log.date.toISOString().split("T")[0]}
      Weight: ${log.weight || "N/A"}
      Blood Pressure: ${log.bloodPressure || "N/A"}
      Notes: ${log.notes || "N/A"}`
      )
      .join("\n\n");

    return `Please analyze the following health logs and provide insights:
    ${logsString}

    Please provide:
    1. Analysis of trends
    2. Areas of concern
    3. Recommendations for improvement
    4. Specific lifestyle adjustments needed`;
  }

  createHealthTipsPrompt(healthProfile) {
    return `Please provide personalized health tips for a cardiovascular patient with:
    - Blood Pressure: ${healthProfile.bloodPressure}
    - Cholesterol Level: ${healthProfile.cholesterolLevel}
    - BMI: ${healthProfile.bmi}
    - Medical Conditions: ${healthProfile.medicalConditions.join(", ")}

    Focus on:
    1. Daily lifestyle recommendations
    2. Exercise suggestions
    3. Stress management tips
    4. Warning signs to watch for
    5. Dietary guidelines`;
  }

  createMealAnalysisPrompt(mealLogs, healthProfile) {
    const mealSummary = mealLogs
      .map(
        (log) =>
          `Date: ${log.date.toISOString().split("T")[0]}
      Meal Type: ${log.mealType}
      Food Items: ${log.foodItems.join(", ")}
      Calories: ${log.calories}`
      )
      .join("\n\n");

    return `Please analyze the following meal history for a cardiovascular patient:

    Patient Profile:
    - BMI: ${healthProfile.bmi}
    - Blood Pressure: ${healthProfile.bloodPressure}
    - Cholesterol Level: ${healthProfile.cholesterolLevel}
    - Medical Conditions: ${healthProfile.medicalConditions.join(", ")}

    Meal History:
    ${mealSummary}

    Please provide:
    1. Analysis of eating patterns
    2. Nutritional balance assessment
    3. Areas for improvement
    4. Specific dietary recommendations
    5. Meal timing suggestions
    6. Foods to increase/decrease
    7. Impact on cardiovascular health`;
  }
}

module.exports = new AIService();
