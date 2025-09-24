import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Star, TrendingUp, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Event } from '../../types';

const TrendingEvents: React.FC = () => {
  const [trendingEvents, setTrendingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingEvents = async () => {
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
          // Filter for trending events (high rating or low availability)
          const trending = mapped
            .filter(event => event.rating && event.rating >= 4.5)
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 3);
          setTrendingEvents(trending);
        } else {
          console.error('Failed to fetch trending events');
        }
      } catch (error) {
        console.error('Error fetching trending events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingEvents();
  }, []);

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
      case 'movies': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'concerts': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'sports': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading trending events...</p>
          </div>
        </div>
      </div>
    );
  }

  if (trendingEvents.length === 0) {
    return (
      <div className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-2">
              <TrendingUp className="h-8 w-8 text-orange-500" />
              Trending Events
            </h2>
            <p className="text-gray-600 dark:text-gray-400">No trending events available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-2">
            <TrendingUp className="h-8 w-8 text-orange-500" />
            Trending Events
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            The most popular events everyone's talking about
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trendingEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="relative">
                <img
                  src={event.poster}
                  alt={event.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = '/logo192.png';
                  }}
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(event.category)}`}>
                    {getCategoryIcon(event.category)} {event.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-bold">{event.rating}</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {event.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {event.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span className="line-clamp-1">{event.venue}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    From ${event.price.regular}
                  </div>
                  <Link
                    to={`/events/${event.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
                  >
                    View Details
                  </Link>
                </div>

                <div className="mt-4 flex flex-wrap gap-1">
                  {event.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            View All Events
            <TrendingUp className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrendingEvents;