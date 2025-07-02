import React, { useEffect, useState } from "react";
import MealCard from "../components/MealCard";

interface MealData {
  title: string;
  preparationTime: string;
  fullSection: string;
}

interface DietRecommendation {
  breakfast: MealData;
  lunch: MealData;
  dinner: MealData;
  fullText: string;
}

const MealPlans: React.FC = () => {
  const [dietData, setDietData] = useState<DietRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [breakfastImageUrl, setBreakfastImageUrl] = useState<string>("");
  const [lunchImageUrl, setLunchImageUrl] = useState<string>("");
  const [dinnerImageUrl, setDinnerImageUrl] = useState<string>("");

  
  useEffect(() => {
  const fetchDietRecommendation = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("🔑 Token found:", token ? "YES" : "NO");
      console.log("🔑 Token length:", token ? token.length : 0);
      
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      console.log("🌐 Making request to:", "http://localhost:5050/api/recommendations/diet");
      
      const res = await fetch("http://localhost:5050/api/recommendations/diet", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log("📡 Response status:", res.status);
      console.log("📡 Response statusText:", res.statusText);
      console.log("📡 Response headers:", Object.fromEntries(res.headers.entries()));
      
      const contentType = res.headers.get("content-type");
      const raw = await res.text(); // Get the raw response
      console.log("📦 Raw response body:", raw);
      console.log("📦 Content-Type:", contentType);

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Authentication failed. Please log in again.");
        }
        throw new Error(`Server error ${res.status}: ${raw}`);
      }

      // Try to parse JSON only if content-type is correct
      if (!contentType?.includes("application/json")) {
        throw new Error("Expected JSON response but got something else");
      }

      const data = JSON.parse(raw); // Safely parse
      console.log("✅ Parsed data:", data);
      setDietData(data);

      // Fetch images for all meals with error handling
      const fetchMealImage = async (title: string, setImageUrl: (url: string) => void) => {
        try {
          const response = await fetch(
            `http://localhost:5050/api/recommendations/image-proxy?query=${encodeURIComponent(title)}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          
          if (response.ok) {
            const imageData = await response.json();
            if (imageData.thumb) {
              setImageUrl(imageData.thumb);
            }
          } else {
            console.error(`Failed to fetch image for ${title}:`, response.status);
          }
        } catch (error) {
          console.error(`Error fetching image for ${title}:`, error);
        }
      };
      
      if (data?.breakfast?.title) {
        await fetchMealImage(data.breakfast.title, setBreakfastImageUrl);
      }
      
      if (data?.lunch?.title) {
        await fetchMealImage(data.lunch.title, setLunchImageUrl);
      }
      
      if (data?.dinner?.title) {
        await fetchMealImage(data.dinner.title, setDinnerImageUrl);
      }
    } catch (error: any) {
      console.error("❌ Fetch error:", error);
      setError(error.message || "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  fetchDietRecommendation();
}, []);


  if (loading) return (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      <span className="ml-2">Loading meal plans...</span>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <i className="fas fa-exclamation-triangle text-red-400"></i>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Error Loading Meal Plan</h3>
          <p className="mt-2 text-sm text-red-700">{error}</p>
        </div>
      </div>
    </div>
  );

  // Show what data we have, even if incomplete
  const hasSomeData = dietData && (dietData.breakfast || dietData.lunch || dietData.dinner);
  
  if (!hasSomeData) {
    return (
      <div className="text-center py-8">
        <i className="fas fa-utensils text-gray-400 text-4xl mb-4"></i>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Meal Plan Available</h3>
        <p className="text-gray-500 mb-4">Complete your health profile to get personalized meal recommendations.</p>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
          Complete Health Profile
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Meal Plans
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Your personalized meal recommendations based on your health profile.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 !rounded-button whitespace-nowrap cursor-pointer"
          >
            <i className="fas fa-calendar-alt mr-2"></i>
            Weekly View
          </button>
          <button
            type="button"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 !rounded-button whitespace-nowrap cursor-pointer"
          >
            <i className="fas fa-sync-alt mr-2"></i>
            Generate New Plan
          </button>
        </div>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Today's Meals - June 21, 2025
            </h3>
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
              1800 kcal/day
            </span>
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {/* Show available meals or placeholder */}
            {/* Breakfast */}
            {dietData.breakfast ? (
              <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                <div className="h-48 w-full overflow-hidden">
                  <img
                    src={breakfastImageUrl || "https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=Breakfast"}
                    alt="Breakfast"
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=Breakfast";
                    }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-medium text-gray-900">
                      Breakfast
                    </h4>
                    <span className="text-sm text-gray-500">7:00 AM</span>
                  </div>
                  <h5 className="text-md font-medium text-gray-800 mb-2">
                    {dietData.breakfast.title}
                  </h5>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <i className="fas fa-fire-alt text-orange-500 mr-2"></i>
                      320 kcal calories
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <i className="fas fa-clock text-blue-500 mr-2"></i>
                      Prep time: {dietData.breakfast.preparationTime}
                    </div>
                  </div>
                  <div className="mt-4">
                    <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 !rounded-button whitespace-nowrap cursor-pointer">
                      <i className="fas fa-info-circle mr-2"></i>
                      View Recipe
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <i className="fas fa-utensils text-gray-400 text-2xl mb-2"></i>
                <h4 className="text-lg font-medium text-gray-900 mb-1">Breakfast</h4>
                <p className="text-sm text-gray-500">Meal recommendation not available</p>
              </div>
            )}

            {/* Lunch */}
            {dietData.lunch ? (
              <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                <div className="h-48 w-full overflow-hidden">
                  <img
                    src={lunchImageUrl || "https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=Lunch"}
                    alt="Lunch"
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=Lunch";
                    }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-medium text-gray-900">Lunch</h4>
                    <span className="text-sm text-gray-500">12:30 PM</span>
                  </div>
                  <h5 className="text-md font-medium text-gray-800 mb-2">
                    {dietData.lunch.title}
                  </h5>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <i className="fas fa-fire-alt text-orange-500 mr-2"></i>
                      450 kcal calories
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <i className="fas fa-clock text-blue-500 mr-2"></i>
                      Prep time: {dietData.lunch.preparationTime}
                    </div>
                  </div>
                  <div className="mt-4">
                    <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 !rounded-button whitespace-nowrap cursor-pointer">
                      <i className="fas fa-info-circle mr-2"></i>
                      View Recipe
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <i className="fas fa-utensils text-gray-400 text-2xl mb-2"></i>
                <h4 className="text-lg font-medium text-gray-900 mb-1">Lunch</h4>
                <p className="text-sm text-gray-500">Meal recommendation not available</p>
              </div>
            )}

            {/* Dinner */}
            {dietData.dinner ? (
              <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                <div className="h-48 w-full overflow-hidden">
                  <img
                    src={dinnerImageUrl || "https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=Dinner"}
                    alt="Dinner"
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=Dinner";
                    }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-medium text-gray-900">Dinner</h4>
                    <span className="text-sm text-gray-500">6:30 PM</span>
                  </div>
                  <h5 className="text-md font-medium text-gray-800 mb-2">
                    {dietData.dinner.title}
                  </h5>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <i className="fas fa-fire-alt text-orange-500 mr-2"></i>
                      380 kcal calories
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <i className="fas fa-clock text-blue-500 mr-2"></i>
                      Prep time: {dietData.dinner.preparationTime}
                    </div>
                  </div>
                  <div className="mt-4">
                    <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 !rounded-button whitespace-nowrap cursor-pointer">
                      <i className="fas fa-info-circle mr-2"></i>
                      View Recipe
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <i className="fas fa-utensils text-gray-400 text-2xl mb-2"></i>
                <h4 className="text-lg font-medium text-gray-900 mb-1">Dinner</h4>
                <p className="text-sm text-gray-500">Meal recommendation not available</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Recommended Snacks & Supplements
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">
                Healthy Snacks
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center text-sm text-gray-600">
                  <i className="fas fa-apple-alt text-red-500 mr-3"></i>1 medium
                  apple with 1 tbsp almond butter (10:30 AM)
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <i className="fas fa-carrot text-orange-500 mr-3"></i>
                  Baby carrots with hummus (3:30 PM)
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <i className="fas fa-seedling text-green-500 mr-3"></i>
                  Mixed nuts and dried fruits (8:30 PM)
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">
                Daily Supplements
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center text-sm text-gray-600">
                  <i className="fas fa-pills text-purple-500 mr-3"></i>
                  Omega-3 Fish Oil (with breakfast)
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <i className="fas fa-tablets text-blue-500 mr-3"></i>
                  Vitamin D3 (with breakfast)
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <i className="fas fa-capsules text-yellow-500 mr-3"></i>
                  Magnesium (before bed)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Daily Nutritional Breakdown
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
            <div className="bg-indigo-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <i className="fas fa-fire-alt text-indigo-600 text-xl"></i>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">
                    Calories
                  </h4>
                  <p className="text-xl font-semibold text-indigo-600">1,800</p>
                  <p className="text-xs text-gray-500">of 2,000 target</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <i className="fas fa-drumstick-bite text-green-600 text-xl"></i>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">Protein</h4>
                  <p className="text-xl font-semibold text-green-600">85g</p>
                  <p className="text-xs text-gray-500">of 90g target</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <i className="fas fa-bread-slice text-yellow-600 text-xl"></i>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">Carbs</h4>
                  <p className="text-xl font-semibold text-yellow-600">200g</p>
                  <p className="text-xs text-gray-500">of 225g target</p>
                </div>
              </div>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <i className="fas fa-cheese text-red-600 text-xl"></i>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">Fats</h4>
                  <p className="text-xl font-semibold text-red-600">55g</p>
                  <p className="text-xs text-gray-500">of 65g target</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPlans;
