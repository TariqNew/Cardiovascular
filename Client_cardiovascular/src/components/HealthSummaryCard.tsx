import React from 'react';

interface HealthSummaryCardProps {
  icon: string;
  title: string;
  value: string;
  change: string;
  bgColor: string;
  iconColor: string;
  linkText: string;
}

const HealthSummaryCard: React.FC<HealthSummaryCardProps> = ({
  icon,
  title,
  value,
  change,
  bgColor,
  iconColor,
  linkText,
}) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden w-full">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${bgColor} rounded-md p-3`}>
            <i className={`fas ${icon} ${iconColor} text-xl`}></i>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">{value}</div>
                  <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                    <i className="fas fa-arrow-down mr-1"></i>
                    <span>{change}</span>
                  </div>
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-4 sm:px-6">
        <div className="text-sm">
          <a
            href="#"
            className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-150 ease-in-out"
          >
            {linkText} <i className="fas fa-arrow-right ml-1"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default HealthSummaryCard;
