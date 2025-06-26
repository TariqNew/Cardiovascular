import React from 'react';
import EducationalResourceCard from '../components/EducationalResourceCard';

const Education: React.FC = () => {
  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Educational Resources
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Expand your knowledge about cardiovascular health and nutrition.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <div className="relative">
            <input
              type="text"
              className="w-64 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-10 py-2"
              placeholder="Search resources..."
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400"></i>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Browse Resources
            </h3>
            <div className="flex space-x-3">
              {['All', 'Articles', 'Videos', 'Guides'].map((filter, index) => (
                <button
                  key={filter}
                  className={`px-3 py-1 text-sm font-medium ${
                    index === 0 ? 'text-indigo-600 bg-indigo-100' : 'text-gray-600 bg-gray-100'
                  } rounded-full !rounded-button whitespace-nowrap cursor-pointer`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <EducationalResourceCard
              icon="fa-book-medical"
              title="Understanding Cholesterol"
              description="Learn about the different types of cholesterol and how they affect your heart health."
              duration="5 min read"
              rating="4.8/5"
              bgColor="bg-indigo-100"
              iconColor="text-indigo-600"
            />
            <EducationalResourceCard
              icon="fa-video"
              title="Cooking for Heart Health"
              description="Video tutorial on preparing heart-healthy meals with simple ingredients."
              duration="12 min video"
              rating="4.9/5"
              bgColor="bg-green-100"
              iconColor="text-green-600"
            />
            <EducationalResourceCard
              icon="fa-file-pdf"
              title="DASH Diet Guide"
              description="Comprehensive guide to following the DASH diet for managing blood pressure."
              duration="PDF download"
              rating="4.7/5"
              bgColor="bg-red-100"
              iconColor="text-red-600"
            />
            <EducationalResourceCard
              icon="fa-heartbeat"
              title="Managing Hypertension"
              description="Article on lifestyle changes to control high blood pressure effectively."
              duration="8 min read"
              rating="4.6/5"
              bgColor="bg-blue-100"
              iconColor="text-blue-600"
            />
            <EducationalResourceCard
              icon="fa-utensils"
              title="Heart-Healthy Recipes"
              description="Collection of easy-to-make recipes for cardiovascular wellness."
              duration="PDF download"
              rating="4.8/5"
              bgColor="bg-yellow-100"
              iconColor="text-yellow-600"
            />
            <EducationalResourceCard
              icon="fa-dumbbell"
              title="Exercise for Heart Health"
              description="Video guide on safe exercises to improve cardiovascular fitness."
              duration="15 min video"
              rating="4.9/5"
              bgColor="bg-purple-100"
              iconColor="text-purple-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Education;