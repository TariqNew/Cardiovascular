import React from 'react';

interface EducationalResourceCardProps {
  icon: string;
  title: string;
  description: string;
  duration: string;
  rating: string;
  bgColor: string;
  iconColor: string;
}

const EducationalResourceCard: React.FC<EducationalResourceCardProps> = ({
  icon,
  title,
  description,
  duration,
  rating,
  bgColor,
  iconColor,
}) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow duration-300">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 h-12 w-12 rounded-md ${bgColor} flex items-center justify-center`}>
            <i className={`fas ${icon} ${iconColor} text-xl`}></i>
          </div>
          <div className="ml-4">
            <h4 className="text-lg font-medium text-gray-900">{title}</h4>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <i className="fas fa-clock mr-1"></i>
              {duration}
              <span className="mx-2">•</span>
              <i className="fas fa-star text-yellow-400 mr-1"></i>
              {rating}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationalResourceCard;