import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'white';
  fullScreen?: boolean;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'primary',
  fullScreen = false,
  text
}) => {
  // Size mapping
  const sizeMap = {
    small: 'w-5 h-5',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  // Color mapping
  const colorMap = {
    primary: 'text-blue-600',
    secondary: 'text-purple-600',
    white: 'text-white'
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? 'h-screen fixed inset-0 bg-gray-900/50 z-50' : ''}`}>
      <div className={`animate-spin rounded-full border-t-2 border-b-2 ${colorMap[color]} ${sizeMap[size]}`}></div>
      {text && <p className={`mt-2 text-sm font-medium ${color === 'white' ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>{text}</p>}
    </div>
  );

  return spinner;
};

export default LoadingSpinner;