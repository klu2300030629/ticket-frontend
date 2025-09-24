import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  type: 'card' | 'text' | 'image' | 'button';
  width?: string | number;
  height?: string | number;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonProps> = ({ 
  type, 
  width, 
  height,
  className = '' 
}) => {
  const shimmerVariants = {
    initial: {
      backgroundPosition: '-500px 0',
    },
    animate: {
      backgroundPosition: '500px 0',
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: "linear" as const
      }
    }
  };

  const getSkeletonStyles = () => {
    const baseStyles = "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded";
    
    switch (type) {
      case 'card':
        return `${baseStyles} w-full h-64 ${className}`;
      case 'text':
        return `${baseStyles} h-4 ${className}`;
      case 'image':
        return `${baseStyles} ${className}`;
      case 'button':
        return `${baseStyles} h-10 w-24 ${className}`;
      default:
        return baseStyles;
    }
  };

  return (
    <motion.div
      className={getSkeletonStyles()}
      style={{ 
        width: width || undefined, 
        height: height || undefined,
        backgroundSize: '1000px 100%'
      }}
      variants={shimmerVariants}
      initial="initial"
      animate="animate"
    />
  );
};

export default SkeletonLoader;