import React, { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Event } from '../types';

const SportEventsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const [events, setEvents] = useState<Event[]>([]);
  useEffect(() => {
    (async () => {
      const res = await fetch('http://52.91.141.5:7070/api/events');
      if (res.ok) {
        const data = await res.json();
        const mapped: Event[] = (data || []).map((e: any) => ({
          id: String(e.id),
          title: e.title,
          description: e.description,
          category: (e.category || 'sports') as any,
          date: e.startTime || '',
          time: '',
          venue: e.venue,
          poster: '/logo192.png',
          price: { regular: 0, vip: 0, premium: 0 },
          availableSeats: 0,
          totalSeats: 0,
          rating: undefined,
          tags: [],
          status: 'upcoming',
        }));
        setEvents(mapped);
      }
    })();
  }, []);

  const sportsEvents = useMemo(() => events.filter(e => (e.category || '').toLowerCase() === 'sports'), [events]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter events based on search term
  };

  const handleEventClick = (eventId: string) => {
    navigate(`/event/${eventId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            🏟️ Sports Events
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300 sm:mt-4">
            Discover exciting sports events and competitions
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-10">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for sports events..."
              className="w-full py-3 pl-12 pr-4 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 border border-gray-300 dark:border-gray-700"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <button type="submit" className="sr-only">Search</button>
          </form>
        </div>

        {/* Filter Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
            All
          </button>
          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition">
            Football
          </button>
          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition">
            Basketball
          </button>
          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition">
            Tennis
          </button>
          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition">
            Cricket
          </button>
          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition">
            Boxing
          </button>
        </div>

        {/* Sport Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sportsEvents.map((event: any, index: number) => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.15)", y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden cursor-pointer"
              onClick={() => handleEventClick(event.id)}
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={event.poster} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{event.title}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {event.category}
                  </span>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span className="mr-4">{new Date(event.date).toLocaleDateString()}</span>
                  <span>{event.time}</span>
                </div>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {event.venue}
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">$0.00</span>
                  <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition">
                    Book Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SportEventsPage;
