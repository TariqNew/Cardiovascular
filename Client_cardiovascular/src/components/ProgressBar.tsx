import React from 'react';

interface ProgressBarProps {
  title: string;
  value: string;
  target: string;
  progress: number;
  icon: string;
  bgColor: string;
  progressColor: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  title,
  value,
  target,
  progress,
  icon,
  bgColor,
  progressColor,
}) => {
  return (
    <div>
      <div className="flex items-center">
        <div className={`flex-shrink-0 h-10 w-10 rounded-full ${bgColor} flex items-center justify-center`}>
          <i className={`fas ${icon} ${progressColor}`}></i>
        </div>
        <div className="ml-4">
          <h4 className="text-lg font-medium text-gray-900">{title}</h4>
          <div className="mt-1 relative pt-1">
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: `${progress}%` }}
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${progressColor}`}
              ></div>
            </div>
            <div className="flex items-center justify-between mt-1">
              <div className="text-xs font-semibold text-gray-600">{value}</div>
              <div className="text-xs font-semibold text-gray-600">{target}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;