import React, { useState } from 'react';
import { Search, Calendar, MapPin, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Navigate to the appropriate page based on category
    if (selectedCategory === 'movies') {
      navigate('/movies');
    } else if (selectedCategory === 'concerts') {
      navigate('/concerts');
    } else if (selectedCategory === 'sports') {
      navigate('/sports');
    } else {
      navigate(`/event?search=${searchTerm}`);
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black bg-opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Discover Amazing
            <span className="block text-yellow-300">Events & Experiences</span>
          </h1>
          
          {/* Subheading */}
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto animate-slide-up">
            Book tickets for movies, concerts, and sports events with ease. 
            Your next unforgettable experience is just a click away!
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12 animate-slide-up">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300">500+</div>
              <div className="text-sm text-blue-100">Events</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300">50K+</div>
              <div className="text-sm text-blue-100">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300">4.8</div>
              <div className="text-sm text-blue-100 flex items-center justify-center gap-1">
                <Star className="h-4 w-4 fill-current" />
                Rating
              </div>
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto animate-bounce-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-2">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for events, artists, or venues..."
                    className="w-full pl-10 pr-4 py-4 text-gray-900 dark:text-white bg-transparent border-0 focus:outline-none focus:ring-0 text-lg"
                  />
                </div>

                {/* Category Select */}
                <div className="md:w-48">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-4 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  >
                    <option value="all">All Categories</option>
                    <option value="movies">🎬 Movies</option>
                    <option value="concerts">🎶 Concerts</option>
                    <option value="sports">🏟️ Sports</option>
                  </select>
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Search Events
                </button>
              </div>
            </div>
          </form>

          {/* Popular Searches */}
          <div className="mt-8 animate-slide-up">
            <p className="text-blue-100 mb-4">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Avengers', 'Taylor Swift', 'Football', 'Rock Concert', 'Comedy Show'].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchTerm(term);
                    navigate(`/events?search=${encodeURIComponent(term)}`);
                  }}
                  className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-sm transition-all duration-200 backdrop-blur-sm"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Wave Pattern */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" className="w-full h-12 text-white dark:text-gray-900">
          <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" fill="currentColor" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;