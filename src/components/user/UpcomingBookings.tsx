import React, { useState } from 'react';
import { Booking, Event } from '../../types';
import { Calendar, MapPin, Clock, Users, Download, Share2, Eye, XCircle } from 'lucide-react';

interface UpcomingBookingsProps {
  bookings: Booking[];
  events: Event[];
}

const UpcomingBookings: React.FC<UpcomingBookingsProps> = ({ bookings, events }) => {
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleDownloadTicket = (bookingId: string) => {
    // Simulate ticket download
    const link = document.createElement('a');
    link.href = `data:text/plain,Ticket for booking ${bookingId}`;
    link.download = `ticket-${bookingId}.txt`;
    link.click();
  };

  const handleShareBooking = (booking: Booking) => {
    const event = getEventById(booking.eventId);
    if (!event) return;
    
    if (navigator.share) {
      navigator.share({
        title: `Event: ${event.title}`,
        text: `Join me at ${event.title} on ${new Date(event.date).toLocaleDateString()}!`,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(
        `Join me at ${event.title} on ${new Date(event.date).toLocaleDateString()} at ${event.venue}!`
      );
      alert('Event details copied to clipboard!');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getEventById = (eventId: string): Event | undefined => {
    return events.find(event => event.id === eventId);
  };

  if (bookings.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Upcoming Bookings</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You don't have any upcoming events booked. Start exploring and book your next experience!
        </p>
        <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200">
          Browse Events
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upcoming Bookings</h2>
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200">
          {bookings.length} Events
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bookings.map((booking) => {
          const event = getEventById(booking.eventId);
          if (!event) return null;
          
          return (
          <div key={booking.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {/* Event Poster */}
            <div className="relative">
              <img
                src={event.poster}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                  {booking.status.toUpperCase()}
                </span>
              </div>
              <div className="absolute bottom-4 left-4">
                <span className="bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                  {booking.seats.length} Tickets
                </span>
              </div>
            </div>

            {/* Booking Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                  {event.title}
                </h3>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(event.time)}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span className="line-clamp-1">{event.venue}</span>
                  </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                  <Users className="h-4 w-4" />
                  <span>Seats: {booking.seats.map(seat => `${seat.row}${seat.number}`).join(', ')}</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Paid</span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  ${booking.totalAmount}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDownloadTicket(booking.id)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  <Download className="h-4 w-4" />
                  <span className="text-sm font-medium">Download</span>
                </button>
                <button
                  onClick={() => handleShareBooking(booking)}
                  className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  <Share2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setSelectedBooking(booking.id)}
                  className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        );})}
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Booking Details</h3>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              {(() => {
                const booking = bookings.find(b => b.id === selectedBooking);
                if (!booking) return null;
                
                const event = getEventById(booking.eventId);
                if (!event) return null;
                
                return (
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <img
                        src={event.poster}
                        alt={event.title}
                        className="w-20 h-30 object-cover rounded-lg"
                      />
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
                          {event.title}
                        </h4>
                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          <p><strong>Booking ID:</strong> {booking.id}</p>
                          <p><strong>Date:</strong> {formatDate(event.date)}</p>
                          <p><strong>Time:</strong> {formatTime(event.time)}</p>
                          <p><strong>Venue:</strong> {event.venue}</p>
                          <p><strong>Status:</strong> 
                            <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(booking.status)}`}>
                              {booking.status.toUpperCase()}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Seat Details</h5>
                      <div className="space-y-2">
                        {booking.seats.map((seat, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${
                                seat.type === 'vip' ? 'bg-purple-400' :
                                seat.type === 'premium' ? 'bg-yellow-400' :
                                'bg-blue-400'
                              }`}></div>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {seat.row}{seat.number} - {seat.type.toUpperCase()}
                              </span>
                            </div>
                            <span className="font-bold text-gray-900 dark:text-white">
                              ${seat.price}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            ${booking.totalAmount - Math.round(booking.totalAmount * 0.05)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Convenience Fee</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            ${Math.round(booking.totalAmount * 0.05)}
                          </span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-700 pt-2">
                          <span className="text-gray-900 dark:text-white">Total</span>
                          <span className="text-green-600 dark:text-green-400">
                            ${booking.totalAmount}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button
                        onClick={() => {
                          handleDownloadTicket(booking.id);
                          setSelectedBooking(null);
                        }}
                        className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors duration-200"
                      >
                        <Download className="h-5 w-5" />
                        <span>Download Ticket</span>
                      </button>
                      <button
                        onClick={() => {
                          handleShareBooking(booking);
                          setSelectedBooking(null);
                        }}
                        className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg transition-colors duration-200"
                      >
                        <Share2 className="h-5 w-5" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingBookings;