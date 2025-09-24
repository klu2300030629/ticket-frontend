import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Music, Trophy } from 'lucide-react';

const CategoryFilter: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const navigate = useNavigate();

  const categories = [
    {
      id: 'all',
      name: 'All Events',
      icon: '🎭',
      description: 'Discover all events',
      color: 'bg-gradient-to-br from-purple-500 to-pink-500',
      count: 500
    },
    {
      id: 'movies',
      name: 'Movies',
      icon: '🎬',
      description: 'Latest blockbusters',
      color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      count: 180
    },
    {
      id: 'concerts',
      name: 'Concerts',
      icon: '🎶',
      description: 'Live music events',
      color: 'bg-gradient-to-br from-purple-500 to-indigo-500',
      count: 200
    },
    {
      id: 'sports',
      name: 'Sports',
      icon: '🏟️',
      description: 'Sports events',
      color: 'bg-gradient-to-br from-green-500 to-emerald-500',
      count: 120
    }
  ];

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    
    // Navigate to the appropriate page based on category
    if (categoryId === 'movies') {
      navigate('/movies');
    } else if (categoryId === 'concerts') {
      navigate('/concerts');
    } else if (categoryId === 'sports') {
      navigate('/sports');
    } else {
      navigate('/event');
    }
  };

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Browse by Category
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find events that match your interests. From blockbuster movies to live concerts and thrilling sports events.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`relative overflow-hidden rounded-2xl cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl ${
                selectedCategory === category.id ? 'ring-4 ring-blue-500 ring-opacity-50' : ''
              }`}
            >
              {/* Background Gradient */}
              <div className={`${category.color} h-48 relative overflow-hidden`}>
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.3'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`
                  }} />
                </div>
                
                {/* Floating Animation Elements */}
                <div className="absolute top-4 right-4 text-6xl opacity-30 animate-bounce">
                  {category.icon}
                </div>
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold">{category.name}</h3>
                    <div className="text-3xl">{category.icon}</div>
                  </div>
                  <p className="text-sm opacity-90 mb-3">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">{category.count} Events</span>
                    <div className="bg-white bg-opacity-20 rounded-full p-2">
                      {category.id === 'movies' && <Film className="h-5 w-5" />}
                      {category.id === 'concerts' && <Music className="h-5 w-5" />}
                      {category.id === 'sports' && <Trophy className="h-5 w-5" />}
                      {category.id === 'all' && <Film className="h-5 w-5" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300" />
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">500+</div>
            <div className="text-gray-600 dark:text-gray-300">Total Events</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">50K+</div>
            <div className="text-gray-600 dark:text-gray-300">Tickets Sold</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">4.9</div>
            <div className="text-gray-600 dark:text-gray-300">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-2">24/7</div>
            <div className="text-gray-600 dark:text-gray-300">Support</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Can't find what you're looking for?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Browse our complete collection of events and discover something new!
          </p>
          <button
            onClick={() => navigate('/events')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            View All Events
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoryFilter;