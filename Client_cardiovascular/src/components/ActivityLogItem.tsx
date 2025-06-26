import React from 'react';

interface ActivityLogItemProps {
  icon: string;
  description: string;
  value: string;
  time: string;
  bgColor: string;
  isLast?: boolean;
}

const ActivityLogItem: React.FC<ActivityLogItemProps> = ({
  icon,
  description,
  value,
  time,
  bgColor,
  isLast = false,
}) => {
  return (
    <li>
      <div className={`relative ${isLast ? '' : 'pb-8'}`}>
        {!isLast && (
          <span
            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
            aria-hidden="true"
          ></span>
        )}
        <div className="relative flex space-x-3">
          <div>
            <span
              className={`h-8 w-8 rounded-full ${bgColor} flex items-center justify-center ring-8 ring-white`}
            >
              <i className={`fas ${icon} text-white`}></i>
            </span>
          </div>
          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
            <div>
              <p className="text-sm text-gray-500">
                {description}:{' '}
                <span className="font-medium text-gray-900">{value}</span>
              </p>
            </div>
            <div className="text-right text-sm whitespace-nowrap text-gray-500">
              <time dateTime={time}>{time}</time>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default ActivityLogItem;