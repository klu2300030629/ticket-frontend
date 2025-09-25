import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Seat, Event } from '../types';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import SeatingChart from '../components/seats/SeatingChart';
import SeatSelectionSidebar from '../components/seats/SeatSelectionSidebar';
import { Calendar, MapPin, Clock, Users, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SeatSelectionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<Event | null>(null);
  
  // Define price tiers for seat types - using event prices
  const priceTiers = event ? {
    regular: event.price.regular,
    vip: event.price.vip,
    premium: event.price.premium
  } : {
    regular: 0,
    vip: 0,
    premium: 0
  };

  // Get event data from location state or fetch it
  useEffect(() => {
    if (location.state?.event) {
      setEvent(location.state.event);
    } else if (id) {
      // Fetch event data if not provided in location state
      (async () => {
        try {
          const res = await fetch(`http://52.91.141.5:7070/api/events/public/${id}`);
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
    }
  }, [id, location.state]);

  // Fetch available seats for the event
  useEffect(() => {
    if (!event) return;
    
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://52.91.141.5:7070/api/events/${event.id}/seats`);
        if (res.ok) {
          const seatsData = await res.json();
          setSeats(seatsData);
        } else {
          // If API fails, generate seats based on event capacity
          generateSeatsFromCapacity();
        }
      } catch (err) {
        console.error('Failed to load seats', err);
        // If API fails, generate seats based on event capacity
        generateSeatsFromCapacity();
      } finally {
        setLoading(false);
      }
    })();
  }, [event]);

  // Function to generate seats based on event capacity
  const generateSeatsFromCapacity = () => {
    if (!event) return;
    
    const seats: Seat[] = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const seatsPerRow = 12;
    const totalCapacity = event.totalSeats || 120; // Default to 120 if not specified
    const availableSeats = event.availableSeats || Math.floor(totalCapacity * 0.8); // Default to 80% available
    
    let seatCount = 0;
    
    rows.forEach((row, rowIndex) => {
      for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
        // Stop adding seats if we've reached total capacity
        if (seatCount >= totalCapacity) break;
        
        // Determine seat type based on row
        let type: 'regular' | 'vip' | 'premium' = 'regular';
        
        if (rowIndex < 2) { // First 2 rows are VIP
          type = 'vip';
        } else if (rowIndex >= rows.length - 2) { // Last 2 rows are premium
          type = 'premium';
        }

        // Determine if seat is available based on availableSeats count
        const status = seatCount < availableSeats ? 'available' : 'booked';

        seats.push({
          id: `${row}${seatNum}`,
          row,
          number: seatNum,
          type,
          status,
          price: event.price[type]
        });
        
        seatCount++;
      }
    });
    
    setSeats(seats);
  };

  const handleSeatSelect = (seatId: string) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(id => id !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };

  const handleRemoveSeat = (seatId: string) => {
    setSelectedSeats(prev => prev.filter(id => id !== seatId));
  };

  const handleProceedToCheckout = () => {
    if (selectedSeats.length > 0 && event) {
      // Store selected seats and event data for checkout
      sessionStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
      sessionStorage.setItem('selectedEvent', JSON.stringify(event));
      navigate('/checkout');
    }
  };

  const selectedSeatObjects = seats.filter(seat => selectedSeats.includes(seat.id));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading seat layout...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Event Details</span>
          </button>
        </div>

        {/* Event Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-start space-x-6">
              <img 
                src={event?.poster + '&auto=format&fit=crop&q=80'} 
                srcSet={`${event?.poster}&auto=format&fit=crop&q=60&w=200 200w, ${event?.poster}&auto=format&fit=crop&q=70&w=400 400w, ${event?.poster}&auto=format&fit=crop&q=80&w=600 600w`}
                sizes="(max-width: 640px) 80px, 120px"
                loading="lazy"
                alt={`${event?.title} poster`}
                className="w-20 h-30 object-cover rounded-lg shadow-md"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {event?.title}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{event?.date ? new Date(event.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : ''}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{event?.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{event?.venue}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="text-right">
                <div className="text-sm text-gray-600 dark:text-gray-400">Selected Seats</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {selectedSeats.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seating Chart */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Users className="h-6 w-6 mr-3 text-blue-600" />
                Select Your Seats
              </h2>
              <SeatingChart
                seats={seats}
                selectedSeats={selectedSeats}
                onSeatSelect={handleSeatSelect}
                priceTiers={priceTiers}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <SeatSelectionSidebar
              event={event || {
                title: '',
                date: '',
                time: '',
                venue: '',
                poster: ''
              }}
              selectedSeats={selectedSeatObjects}
              priceTiers={priceTiers}
              onRemoveSeat={handleRemoveSeat}
              onProceedToCheckout={handleProceedToCheckout}
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">How to Select Seats:</h3>
          <ul className="space-y-2 text-blue-800 dark:text-blue-200 text-sm">
            <li className="flex items-start space-x-2">
              <span className="font-bold">1.</span>
              <span>Click on available seats (blue, purple, or yellow) to select them</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="font-bold">2.</span>
              <span>Hover over seats to see their price and details</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="font-bold">3.</span>
              <span>Selected seats will turn green and appear in your cart</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="font-bold">4.</span>
              <span>Red seats are already booked and cannot be selected</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="font-bold">5.</span>
              <span>Proceed to checkout when you're ready to complete your booking</span>
            </li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SeatSelectionPage;
