const { PrismaClient } = require("@prisma/client");
const aiService = require("../services/ai.service");
const prisma = new PrismaClient();
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const PdfParse = require("pdf-parse");
const { parseFile } = require("../services/Parse");
const { offlineService } = require("../services/offline.service");
const dotenv = require("dotenv");
dotenv.config();

// Helper function to parse AI response into structured sections
function parseAIResponse(aiResponse) {
  if (!aiResponse || typeof aiResponse !== 'string') {
    return [];
  }

  const sections = [];
  const lines = aiResponse.split('\n');
  let currentSection = null;
  let sectionContent = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check for section headers (##, #, **, numbered lists, etc.)
    if (isHeaderLine(line)) {
      // Save previous section if exists
      if (currentSection) {
        sections.push({
          ...currentSection,
          content: sectionContent.join('\n').trim(),
          wordCount: sectionContent.join(' ').split(/\s+/).filter(Boolean).length
        });
      }
      
      // Start new section
      currentSection = {
        id: sections.length + 1,
        title: cleanHeaderText(line),
        type: determineContentType(line),
        priority: determinePriority(line),
        category: determineCategory(line)
      };
      sectionContent = [];
    } else if (line && currentSection) {
      // Add content to current section
      sectionContent.push(line);
    } else if (line && !currentSection) {
      // Handle content before any header
      if (!currentSection) {
        currentSection = {
          id: 1,
          title: 'Introduction',
          type: 'general',
          priority: 'medium',
          category: 'general'
        };
      }
      sectionContent.push(line);
    }
  }
  
  // Add the last section
  if (currentSection) {
    sections.push({
      ...currentSection,
      content: sectionContent.join('\n').trim(),
      wordCount: sectionContent.join(' ').split(/\s+/).filter(Boolean).length
    });
  }
  
  return sections;
}

function isHeaderLine(line) {
  return (
    line.startsWith('##') ||
    line.startsWith('#') ||
    line.startsWith('**') && line.endsWith('**') ||
    /^\d+\.\s/.test(line) ||
    /^[A-Z][^a-z]*:/.test(line) ||
    line.toUpperCase() === line && line.length > 3 && line.length < 50
  );
}

function cleanHeaderText(line) {
  return line
    .replace(/^#+\s*/, '')           // Remove ## or #
    .replace(/^\*\*|\*\*$/, '')      // Remove ** markers
    .replace(/^\d+\.\s*/, '')        // Remove numbering
    .replace(/:$/, '')               // Remove trailing colon
    .trim();
}

function determineContentType(title) {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('recommendation') || lowerTitle.includes('suggest')) {
    return 'recommendation';
  }
  if (lowerTitle.includes('warning') || lowerTitle.includes('caution')) {
    return 'warning';
  }
  if (lowerTitle.includes('tip') || lowerTitle.includes('advice')) {
    return 'tip';
  }
  if (lowerTitle.includes('instruction') || lowerTitle.includes('step')) {
    return 'instruction';
  }
  
  return 'general';
}

function determinePriority(title) {
  const lowerTitle = title.toLowerCase();
  const highPriorityKeywords = [
    'urgent', 'critical', 'important', 'immediately', 'emergency',
    'blood pressure', 'cholesterol', 'heart', 'cardiovascular'
  ];
  const lowPriorityKeywords = [
    'general', 'tip', 'suggestion', 'consider', 'optional', 'lifestyle'
  ];
  
  if (highPriorityKeywords.some(keyword => lowerTitle.includes(keyword))) {
    return 'high';
  }
  if (lowPriorityKeywords.some(keyword => lowerTitle.includes(keyword))) {
    return 'low';
  }
  
  return 'medium';
}

function determineCategory(title) {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('diet') || lowerTitle.includes('food') || 
      lowerTitle.includes('nutrition') || lowerTitle.includes('meal')) {
    return 'nutrition';
  }
  if (lowerTitle.includes('exercise') || lowerTitle.includes('activity') || 
      lowerTitle.includes('workout') || lowerTitle.includes('physical')) {
    return 'exercise';
  }
  if (lowerTitle.includes('medication') || lowerTitle.includes('drug') || 
      lowerTitle.includes('medicine') || lowerTitle.includes('prescription')) {
    return 'medication';
  }
  if (lowerTitle.includes('lifestyle') || lowerTitle.includes('habit') || 
      lowerTitle.includes('routine') || lowerTitle.includes('behavior')) {
    return 'lifestyle';
  }
  if (lowerTitle.includes('monitor') || lowerTitle.includes('track') || 
      lowerTitle.includes('measurement') || lowerTitle.includes('check')) {
    return 'monitoring';
  }
  
  return 'general';
}

class RecommendationController {
  async getHealthRecommendations(req, res) {
    try {
      const { userId } = req.user;
      console.log(`🔍 Fetching health recommendations for user ${userId}`);

      const healthProfile = await prisma.healthProfile.findUnique({
        where: { userId },
      });

      if (!healthProfile) {
        console.log(`❌ Health profile not found for user ${userId}`);
        return res.status(404).json({ 
          success: false,
          message: "Health profile not found. Please complete your health profile first." 
        });
      }

      console.log(`✅ Health profile found for user ${userId}`);

      //Parse the uploaded file and get text
      console.log("📄 Parsing medical document...");
      const fileText = await parseFile();
      
      console.log("📄 File text extracted:", fileText?.substring(0, 200) + "...");
      
      // Get the complete AI response
      console.log("🤖 Generating AI recommendations...");
      const tips = await offlineService(fileText);
      console.log("🤖 AI Response generated, length:", tips?.length || 0);
      
      if (!tips || tips.length === 0) {
        throw new Error("AI service returned empty recommendations");
      }
      
      // Parse the AI response into structured sections
      console.log("📊 Parsing AI response into sections...");
      const parsedSections = parseAIResponse(tips);
      console.log("📊 Parsed sections:", parsedSections.length);
      
      // Return complete response with multiple formats
      res.json({ 
        success: true,
        data: {
          // Raw AI response
          fullResponse: tips,
          
          // Parsed into sections
          sections: parsedSections,
          
          // Additional metadata
          metadata: {
            generatedAt: new Date().toISOString(),
            userId: userId,
            profileData: {
              age: healthProfile.age,
              weight: healthProfile.weight,
              height: healthProfile.height,
              bloodPressure: healthProfile.bloodPressure,
              cholesterolLevel: healthProfile.cholesterolLevel,
              medicalConditions: healthProfile.medicalConditions
            }
          },
          
          // Summary statistics
          summary: {
            totalSections: parsedSections.length,
            wordCount: tips?.split(/\s+/).length || 0,
            hasHighPriorityItems: parsedSections.some(s => 
              s.priority === 'high' || 
              s.content.toLowerCase().includes('urgent') || 
              s.content.toLowerCase().includes('important')
            )
          }
        }
      });
    } catch (error) {
      console.error("❌ Error in getHealthRecommendations:", error);
      console.error("❌ Error stack:", error.stack);
      res.status(500).json({ 
        success: false,
        message: "Failed to get health recommendations",
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

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

      console.log(rawText);

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

        const rawTitle = lines[0] || "N/A";
        const title = rawTitle.replace(/^\*\*(.*?)\*\*$/, "$1").trim();

        return {
          title,
          preparationTime: "10-15 mins",
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
      });
    } catch (error) {
      console.error("Error in getDietRecommendation:", error);
      res.status(500).json({
        message: "Failed to get diet recommendation",
        error: error.message,
      });
    }
  }

  async imageProxy(req, res) {
    try {
      const { query } = req.query;

      if (!query)
        return res.status(400).json({ message: "Missing query param" });

      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
      );

      console.log("Unsplash API response status:", response.status);

      if (!response.ok) {
        console.error("Unsplash API error:", response.status, response.statusText);
        // Return a fallback image URL or placeholder
        return res.json({ 
          thumb: "https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=No+Image"
        });
      }

      const data = await response.json();
      console.log("Unsplash API response data:", JSON.stringify(data, null, 2));
      
      const image = data.results?.[0];

      if (!image) {
        console.log("No image found in results");
        // Return a fallback image URL
        return res.json({ 
          thumb: "https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=No+Image"
        });
      }

      // Return only the thumbnail URL
      res.json({ thumb: image.urls.thumb });
    } catch (err) {
      console.error("Image Proxy Error:", err);
      // Return a fallback image instead of error
      res.json({ 
        thumb: "https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=Error"
      });
    }
  }

  async getHealthAnalysis(req, res) {
    try {
      const { userId } = req.user;
      const { days = 30 } = req.query;

      // Get user's health profile
      const healthProfile = await prisma.healthProfile.findUnique({
        where: { userId },
      });

      if (!healthProfile) {
        return res.status(404).json({ message: "Health profile not found" });
      }

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

      // Generate meal recommendations
      const mealTypes = ["BREAKFAST", "LUNCH", "DINNER"];
      const mealPlan = {};

      for (const mealType of mealTypes) {
        const recommendation = await aiService.generateDietRecommendation(
          healthProfile,
          mealType
        );
        mealPlan[mealType.toLowerCase()] = recommendation;
      }

      // Generate AI health trend analysis
      const analysis = await aiService.analyzeHealthTrends(healthLogs);

      res.json({ analysis, mealPlan });
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
