import React from 'react';

const NotificationPanel: React.FC = () => {
  return (
    <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
      <div className="py-1">
        <div className="px-4 py-2 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
        </div>
        <div className="max-h-72 overflow-y-auto">
          {[
            {
              icon: 'fa-utensils text-green-500',
              title: 'New meal plan available',
              description: 'Your meal plan for today has been updated',
              time: '10 minutes ago',
            },
            {
              icon: 'fa-heartbeat text-red-500',
              title: 'Blood pressure reminder',
              description: "Don't forget to log your blood pressure today",
              time: '1 hour ago',
            },
            {
              icon: 'fa-book-medical text-blue-500',
              title: 'New article available',
              description: 'Check out "Managing Cholesterol Through Diet"',
              time: 'Yesterday',
            },
          ].map((notification, index) => (
            <div key={index} className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <i className={`fas ${notification.icon}`}></i>
                </div>
                <div className="ml-3 w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                  <p className="text-sm text-gray-500">{notification.description}</p>
                  <p className="mt-1 text-xs text-gray-500">{notification.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200">
          <button className="block w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-gray-100 cursor-pointer">
            View all notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;