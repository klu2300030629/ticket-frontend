import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Star, Users, Tag, ArrowLeft, Share2, Heart } from 'lucide-react';
import { Event } from '../types';

const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedPriceTier, setSelectedPriceTier] = useState<'regular' | 'vip' | 'premium'>('regular');

  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/events/public/${id}`);
        if (res.ok) {
          const e = await res.json();
          const mapped: Event = {
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
          };
          setEvent(mapped);
        }
      } catch (err) {
        console.error('Failed to load event', err);
      }
    })();
  }, [id]);

  // SEO: update title/description and JSON-LD structured data
  React.useEffect(() => {
    if (!event) return;
    document.title = `${event.title} | TicketHub`;
    const desc = `${event.title} on ${new Date(event.date).toLocaleDateString()} at ${event.venue}. Book tickets now.`;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', desc);
    } else {
      const m = document.createElement('meta');
      m.name = 'description';
      m.content = desc;
      document.head.appendChild(m);
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: event.title,
      startDate: `${event.date}T${event.time}:00`,
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: {
        '@type': 'Place',
        name: event.venue,
      },
      image: [event.poster],
      description: event.description,
      offers: {
        '@type': 'Offer',
        price: event.price.regular,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock'
      }
    });
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [event?.title, event?.date, event?.venue, event?.description, event?.poster, event?.price?.regular, event?.time]);

  const handleBookNow = () => {
    if (!event) return;
    navigate(`/event/${id}/seats`, { 
      state: { 
        event, 
        quantity, 
        priceTier: selectedPriceTier,
        totalPrice: quantity * event.price[selectedPriceTier]
      } 
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'movies': return '🎬';
      case 'concerts': return '🎶';
      case 'sports': return '🏟️';
      default: return '🎭';
    }
  };

  const getPriceTierColor = (tier: string) => {
    switch (tier) {
      case 'regular': return 'border-blue-500 bg-blue-50 text-blue-700';
      case 'vip': return 'border-purple-500 bg-purple-50 text-purple-700';
      case 'premium': return 'border-yellow-500 bg-yellow-50 text-yellow-700';
      default: return 'border-gray-500 bg-gray-50 text-gray-700';
    }
  };

  if (!event) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Events</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Image and Basic Info */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              {/* Event Image */}
              <div className="relative h-96">
                <img
                  src={event.poster + '&auto=format&fit=crop&q=80'}
                  srcSet={`${event.poster}&auto=format&fit=crop&q=60&w=600 600w, ${event.poster}&auto=format&fit=crop&q=70&w=900 900w, ${event.poster}&auto=format&fit=crop&q=80&w=1200 1200w`}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 66vw"
                  loading="lazy"
                  alt={`${event.title} poster`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-900">
                    {getCategoryIcon(event.category)} {event.category}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                    <Share2 className="h-5 w-5 text-gray-700" />
                  </button>
                  <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                    <Heart className="h-5 w-5 text-red-500" />
                  </button>
                </div>

                {/* Rating */}
                {event.rating && (
                  <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="text-white font-medium">{event.rating}</span>
                    <span className="text-gray-300 text-sm">(1.2k reviews)</span>
                  </div>
                )}
              </div>

              {/* Event Details */}
              <div className="p-6 md:p-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {event.title}
                </h1>

                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8">
                  {event.description}
                </p>

                {/* Event Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(event.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
                      <p className="font-medium text-gray-900 dark:text-white">{event.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Venue</p>
                      <p className="font-medium text-gray-900 dark:text-white">{event.venue}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Available Seats</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {event.availableSeats} / {event.totalSeats}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-3">
                    <Tag className="h-5 w-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Availability Progress */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Seat Availability</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {Math.round((event.availableSeats / event.totalSeats) * 100)}% Available
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(event.availableSeats / event.totalSeats) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Book Your Tickets</h3>

              {/* Price Tiers */}
              <div className="space-y-4 mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white">Select Price Tier</h4>
                {Object.entries(event.price).map(([tier, price]) => (
                  <label
                    key={tier}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedPriceTier === tier
                        ? getPriceTierColor(tier)
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="priceTier"
                        value={tier}
                        checked={selectedPriceTier === tier}
                        onChange={(e) => setSelectedPriceTier(e.target.value as 'regular' | 'vip' | 'premium')}
                        className="text-blue-600"
                      />
                      <div>
                        <p className="font-medium capitalize">{tier}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {tier === 'regular' && 'Standard seating'}
                          {tier === 'vip' && 'Premium seating with extras'}
                          {tier === 'premium' && 'Best seats + VIP treatment'}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-lg">${price}</span>
                  </label>
                ))}
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Number of Tickets
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price Summary */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Price per ticket</span>
                    <span className="font-medium">${event.price[selectedPriceTier]}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Quantity</span>
                    <span className="font-medium">{quantity}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-700 pt-2">
                    <span>Total</span>
                    <span className="text-blue-600 dark:text-blue-400">
                      ${quantity * event.price[selectedPriceTier]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Book Now Button */}
              <button
                onClick={handleBookNow}
                disabled={event.availableSeats < quantity}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none ${
                  event.availableSeats >= quantity
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                {event.availableSeats >= quantity ? 'Book Now' : 'Sold Out'}
              </button>

              {/* Additional Info */}
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Secure checkout • Instant confirmation
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;