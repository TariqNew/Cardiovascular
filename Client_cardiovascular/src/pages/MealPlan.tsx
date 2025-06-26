import React from 'react';
import MealCard from '../components/MealCard';

const MealPlans: React.FC = () => {
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
            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
              <div className="h-48 w-full overflow-hidden">
                <img
                  src="https://readdy.ai/api/search-image?query=Healthy%20breakfast%20with%20oatmeal%20topped%20with%20fresh%20berries%2C%20sliced%20almonds%2C%20and%20honey%2C%20served%20with%20a%20glass%20of%20fresh%20orange%20juice.%20Clean%20eating%20concept%20with%20natural%20morning%20light&width=600&height=400&seq=4&orientation=landscape"
                  alt="Breakfast"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-medium text-gray-900">Breakfast</h4>
                  <span className="text-sm text-gray-500">7:00 AM</span>
                </div>
                <h5 className="text-md font-medium text-gray-800 mb-2">Berry Oatmeal Bowl</h5>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <i className="fas fa-fire-alt text-orange-500 mr-2"></i>
                    320 calories
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <i className="fas fa-clock text-blue-500 mr-2"></i>
                    Prep time: 10 mins
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
            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
              <div className="h-48 w-full overflow-hidden">
                <img
                  src="https://readdy.ai/api/search-image?query=Healthy%20Mediterranean%20lunch%20with%20grilled%20salmon%20fillet%2C%20quinoa%2C%20roasted%20vegetables%2C%20and%20fresh%20herbs.%20Served%20on%20a%20white%20plate%20with%20lemon%20wedges.%20Clean%20eating%20concept&width=600&height=400&seq=5&orientation=landscape"
                  alt="Lunch"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-medium text-gray-900">Lunch</h4>
                  <span className="text-sm text-gray-500">12:30 PM</span>
                </div>
                <h5 className="text-md font-medium text-gray-800 mb-2">Grilled Salmon & Quinoa</h5>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <i className="fas fa-fire-alt text-orange-500 mr-2"></i>
                    450 calories
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <i className="fas fa-clock text-blue-500 mr-2"></i>
                    Prep time: 25 mins
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
            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
              <div className="h-48 w-full overflow-hidden">
                <img
                  src="https://readdy.ai/api/search-image?query=Healthy%20dinner%20with%20herb%20roasted%20chicken%20breast%2C%20steamed%20broccoli%2C%20and%20sweet%20potato%20mash.%20Served%20on%20a%20white%20plate%20with%20fresh%20herbs%20garnish.%20Clean%20eating%20concept&width=600&height=400&seq=6&orientation=landscape"
                  alt="Dinner"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-medium text-gray-900">Dinner</h4>
                  <span className="text-sm text-gray-500">6:30 PM</span>
                </div>
                <h5 className="text-md font-medium text-gray-800 mb-2">Herb Chicken & Vegetables</h5>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <i className="fas fa-fire-alt text-orange-500 mr-2"></i>
                    380 calories
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <i className="fas fa-clock text-blue-500 mr-2"></i>
                    Prep time: 30 mins
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
              <h4 className="text-md font-medium text-gray-900 mb-4">Healthy Snacks</h4>
              <ul className="space-y-3">
                <li className="flex items-center text-sm text-gray-600">
                  <i className="fas fa-apple-alt text-red-500 mr-3"></i>
                  1 medium apple with 1 tbsp almond butter (10:30 AM)
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
              <h4 className="text-md font-medium text-gray-900 mb-4">Daily Supplements</h4>
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
                  <h4 className="text-sm font-medium text-gray-900">Calories</h4>
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