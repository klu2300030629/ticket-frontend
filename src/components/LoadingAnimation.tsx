import React from 'react';
import { motion } from 'framer-motion';

interface LoadingAnimationProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  size = 'medium', 
  color = '#3B82F6' 
}) => {
  const circleSize = {
    small: 4,
    medium: 6,
    large: 8
  };

  const containerSize = {
    small: 24,
    medium: 40,
    large: 64
  };

  const containerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear" as const
      }
    }
  };

  const circleVariants = {
    initial: { opacity: 0.3 },
    animate: (i: number) => ({
      opacity: [0.3, 1, 0.3],
      transition: {
        duration: 1,
        repeat: Infinity,
        delay: i * 0.2,
        ease: "easeInOut" as const
      }
    })
  };

  return (
    <motion.div
      className="flex items-center justify-center"
      style={{ width: containerSize[size], height: containerSize[size] }}
      variants={containerVariants}
      animate="animate"
    >
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          custom={i}
          variants={circleVariants}
          initial="initial"
          animate="animate"
          style={{
            width: circleSize[size],
            height: circleSize[size],
            borderRadius: '50%',
            backgroundColor: color,
            margin: circleSize[size] / 2,
            position: 'absolute',
            transform: `rotate(${i * 90}deg) translate(${containerSize[size] / 2 - circleSize[size]}px, 0)`
          }}
        />
      ))}
    </motion.div>
  );
};

export default LoadingAnimation;