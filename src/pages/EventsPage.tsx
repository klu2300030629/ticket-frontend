import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Star, Search } from 'lucide-react';
import { Event } from '../types';

const EventsPage: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://52.91.141.5:7070/api/events/public');
        const data = await res.json();
        // Map backend EventResponse to frontend Event shape minimal
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
      } catch (err) {
        console.error('Failed to load events', err);
      }
    })();
  }, []);

  const categories = ['all', 'movies', 'concerts', 'sports', 'theater'];
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'popularity'>('date');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const id = setTimeout(() => setSearchTerm(searchInput), 300);
    return () => clearTimeout(id);
  }, [searchInput]);

  const filteredEvents = useMemo(() => events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === null || selectedCategory === 'all' || event.category === selectedCategory;
    const matchesTags = selectedTags.length === 0 || selectedTags.every(t => event.tags?.map(x => x.toLowerCase()).includes(t.toLowerCase()));
    return matchesSearch && matchesCategory && matchesTags;
  }), [events, searchTerm, selectedCategory, selectedTags]);

  const sortedEvents = useMemo(() => {
    const arr = [...filteredEvents];
    if (sortBy === 'date') {
      arr.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sortBy === 'price') {
      arr.sort((a, b) => a.price.regular - b.price.regular);
    } else if (sortBy === 'popularity') {
      arr.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return arr;
  }, [filteredEvents, sortBy]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'movies': return '🎬';
      case 'concerts': return '🎶';
      case 'sports': return '🏟️';
      case 'theater': return '🎭';
      default: return '🎟️';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Upcoming Events
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover and book tickets for the hottest events in your area
          </p>
        </div>

        {/* Search, Filter, Sort */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Search events..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                aria-label="Search events"
              />
              {searchInput && (
                <button
                  onClick={() => { setSearchInput(''); setSearchTerm(''); }}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus-visible:ring-2 focus-visible:ring-purple-500 rounded-r-lg"
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category === 'all' ? null : category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    (category === 'all' && selectedCategory === null) || category === selectedCategory
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {category !== 'all' && getCategoryIcon(category)} {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            {/* Sort By */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-gray-700 dark:text-gray-300">Sort by</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'price' | 'popularity')}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="date">Date</option>
                <option value="price">Price</option>
                <option value="popularity">Popularity</option>
              </select>
            </div>
          </div>

          {/* Tag filters (chips) */}
          <div className="mt-4 flex flex-wrap gap-2">
            {['Action','Adventure','Superhero','Pop','Live','Basketball','NBA','Finals'].map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${selectedTags.includes(tag) ? 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-200 dark:border-purple-800' : 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                {tag}
              </button>
            ))}
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="px-3 py-1 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Clear tags
              </button>
            )}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {sortedEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden focus-within:ring-2 focus-within:ring-purple-500"
            >
              {/* Event Image */}
              <div className="relative h-48">
                <img
                  src={event.poster + '&auto=format&fit=crop&q=80'}
                  srcSet={`${event.poster}&auto=format&fit=crop&q=60&w=300 300w, ${event.poster}&auto=format&fit=crop&q=70&w=600 600w, ${event.poster}&auto=format&fit=crop&q=80&w=900 900w`}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                  alt={`${event.title} poster`}
                  className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-black/50 text-white">
                    {getCategoryIcon(event.category)} {event.category}
                  </span>
                </div>

                {/* Rating */}
                {event.rating && (
                  <div className="absolute top-4 right-4 flex items-center space-x-1 bg-black/50 px-2 py-1 rounded-lg">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-white text-sm font-medium">{event.rating}</span>
                  </div>
                )}
              </div>

              {/* Event Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {event.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {event.description}
                </p>

                {/* Event Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <Calendar className="h-4 w-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <Clock className="h-4 w-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <MapPin className="h-4 w-4" />
                    <span>{event.venue}</span>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">From</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      ${event.price.regular}
                    </p>
                  </div>
                  <Link
                    to={`/event/${event.id}`}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">No events found.</p>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Try clearing filters or searching a different term.</p>
            <button 
              onClick={() => {
                setSearchInput('');
                setSearchTerm('');
                setSelectedCategory(null);
              }}
              className="mt-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors focus-visible:ring-2 focus-visible:ring-purple-500"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
