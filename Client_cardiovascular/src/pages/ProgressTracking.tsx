import React, { useEffect } from 'react';
import AchievementCard from '../components/AchievementCard';
import ActivityLogItem from '../components/ActivityLogItem';
import { initializeCharts } from '../services/chartService';

const ProgressTracking: React.FC = () => {
  useEffect(() => {
    initializeCharts();
  }, []);

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Progress Tracking
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Monitor your health improvements and achievements over time.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 !rounded-button whitespace-nowrap cursor-pointer"
          >
            <i className="fas fa-download mr-2"></i>
            Export Data
          </button>
          <button
            type="button"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 !rounded-button whitespace-nowrap cursor-pointer"
          >
            <i className="fas fa-plus mr-2"></i>
            Add Measurement
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
        <AchievementCard
          icon="fa-trophy"
          title="30 Day Streak"
          description="Consistent Health Tracking"
          gradient="from-purple-500 to-indigo-600"
        />
        <AchievementCard
          icon="fa-heart"
          title="BP Goal Achieved"
          description="Maintained for 2 Weeks"
          gradient="from-green-500 to-teal-600"
        />
        <AchievementCard
          icon="fa-weight"
          title="Weight Goal"
          description="Lost 3kg This Month"
          gradient="from-orange-500 to-pink-600"
        />
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Health Metrics Timeline
            </h3>
            <div className="flex space-x-3">
              {['1M', '3M', '6M', '1Y'].map((period, index) => (
                <button
                  key={period}
                  className={`px-3 py-1 text-sm font-medium ${
                    index === 0 ? 'text-indigo-600 bg-indigo-100' : 'text-gray-600 bg-gray-100'
                  } rounded-full !rounded-button whitespace-nowrap cursor-pointer`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6">
            <div id="weight-chart" style={{ height: '300px' }}></div>
            <div id="bp-chart" style={{ height: '300px' }}></div>
            <div id="cholesterol-chart" style={{ height: '300px' }}></div>
          </div>
        </div>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Recent Activity Log
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="flow-root">
            <ul className="-mb-8">
              <ActivityLogItem
                icon="fa-check"
                description="Blood pressure reading"
                value="120/75 mmHg"
                time="Today, 9:00 AM"
                bgColor="bg-green-500"
              />
              <ActivityLogItem
                icon="fa-weight"
                description="Weight logged"
                value="77 kg"
                time="Today, 8:30 AM"
                bgColor="bg-blue-500"
              />
              <ActivityLogItem
                icon="fa-pills"
                description="Medication taken"
                value="Morning routine completed"
                time="Today, 8:00 AM"
                bgColor="bg-purple-500"
              />
              <ActivityLogItem
                icon="fa-utensils"
                description="Meal logged"
                value="Breakfast - Oatmeal with berries"
                time="Today, 7:30 AM"
                bgColor="bg-green-500"
                isLast={true}
              />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracking;