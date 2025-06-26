import React from 'react';

interface MealCardProps {
  title: string;
  description: string;
  image: string;
  alt: string;
  calories: string;
  feature: string;
  featureIcon: string;
  featureColor: string;
}

const MealCard: React.FC<MealCardProps> = ({
  title,
  description,
  image,
  alt,
  calories,
  feature,
  featureIcon,
  featureColor,
}) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="h-48 w-full overflow-hidden">
        <img src={image} alt={alt} className="w-full h-full object-cover object-top" />
      </div>
      <div className="px-4 py-4">
        <h4 className="text-md font-medium text-gray-900">{title}</h4>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <i className="fas fa-fire-alt text-orange-500 mr-1"></i>
          {calories}
          <span className="mx-2">•</span>
          <i className={`fas ${featureIcon} ${featureColor} mr-1`}></i>
          {feature}
        </div>
        <button className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 !rounded-button whitespace-nowrap cursor-pointer">
          <i className="fas fa-info-circle mr-1"></i>
          View details
        </button>
      </div>
    </div>
  );
};

export default MealCard;