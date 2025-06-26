import React from 'react';

interface AchievementCardProps {
  icon: string;
  title: string;
  description: string;
  gradient: string;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  icon,
  title,
  description,
  gradient,
}) => {
  return (
    <div className={`bg-gradient-to-br ${gradient} overflow-hidden shadow rounded-lg text-white`}>
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-white bg-opacity-20 rounded-full p-3">
            <i className={`fas ${icon} text-2xl`}></i>
          </div>
          <div className="ml-5">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-white text-opacity-80">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementCard;