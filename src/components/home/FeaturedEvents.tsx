import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Event } from '../../types';

const FeaturedEvents: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8080/api/events/public');
        if (response.ok) {
          const data = await response.json();
          const mapped: Event[] = (data || []).map((e: any) => ({
            id: String(e.id),
            title: e.title,
            description: e.description,
            category: (e.category || 'movies') as any,
            date: e.startTime || '',
            time: e.time || '',
            venue: e.venue,
            poster: e.poster || '/logo192.png',
            price: e.price || { regular: 0, vip: 0, premium: 0 },
            availableSeats: e.availableSeats || 0,
            totalSeats: e.totalSeats || 0,
            rating: e.rating,
            tags: e.tags || [],
            status: e.status || 'upcoming',
          }));
          setEvents(mapped);
        } else {
          console.error('Failed to fetch events');
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % events.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [events.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % events.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + events.length) % events.length);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'movies': return '🎬';
      case 'concerts': return '🎶';
      case 'sports': return '🏟️';
      default: return '🎭';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'movies': return 'bg-blue-100 text-blue-800';
      case 'concerts': return 'bg-purple-100 text-purple-800';
      case 'sports': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading featured events...</p>
          </div>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Featured Events</h2>
            <p className="text-gray-600 dark:text-gray-400">No events available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={contentVariants}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Featured Events
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover the most exciting events happening around you. From concerts to sports, 
            we have something for everyone.
          </p>
        </motion.div>

        <div className="relative">
          <motion.div
            key={currentSlide}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl shadow-2xl"
          >
            <div className="relative h-96 md:h-[500px]">
              <img
                src={events[currentSlide]?.poster}
                alt={events[currentSlide]?.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/logo192.png';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={contentVariants}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(events[currentSlide]?.category)}`}>
                      {getCategoryIcon(events[currentSlide]?.category)} {events[currentSlide]?.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{events[currentSlide]?.rating}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl font-bold mb-4">
                    {events[currentSlide]?.title}
                  </h3>
                  
                  <p className="text-lg mb-6 max-w-2xl opacity-90">
                    {events[currentSlide]?.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-6 mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      <span className="font-medium">
                        {new Date(events[currentSlide]?.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      <span className="font-medium">{events[currentSlide]?.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      <span className="font-medium">{events[currentSlide]?.venue}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold">
                      From ${events[currentSlide]?.price?.regular}
                    </div>
                    <Link
                      to={`/events/${events[currentSlide]?.id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {events.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-200"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-200"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {events.length > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              {events.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentSlide
                      ? 'bg-blue-600 scale-110'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedEvents;