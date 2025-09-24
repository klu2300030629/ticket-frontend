import React from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturedEvents from '../components/home/FeaturedEvents';
import CategoryFilter from '../components/home/CategoryFilter';
import TrendingEvents from '../components/home/TrendingEvents';
import ScrollAnimation from '../components/ScrollAnimation';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div 
        className="absolute top-20 right-10 w-64 h-64 rounded-full bg-blue-500 opacity-10 blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      />
      <motion.div 
        className="absolute bottom-40 left-10 w-80 h-80 rounded-full bg-purple-500 opacity-10 blur-3xl"
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      <HeroSection />
      <FeaturedEvents />
      
      <div className="container mx-auto px-4 py-12">
        <ScrollAnimation animation="fadeIn">
          <CategoryFilter />
        </ScrollAnimation>
        
        <ScrollAnimation animation="slideUp" delay={0.2}>
          <div className="mt-16">
            <TrendingEvents />
          </div>
        </ScrollAnimation>
      </div>
    </div>
  );
};

export default HomePage;