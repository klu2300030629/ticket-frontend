import React, { useState } from 'react';
import { Booking, Event } from '../../types';
import { Calendar, MapPin, Clock, Download, Eye, QrCode, XCircle } from 'lucide-react';

interface PastBookingsProps {
  bookings: Booking[];
  events: Event[];
}

const PastBookings: React.FC<PastBookingsProps> = ({ bookings, events }) => {
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [showQR, setShowQR] = useState<string | null>(null);

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

  const generateQRCode = (bookingId: string) => {
    // Simulate QR code generation
    return `QR_${bookingId}_${Date.now()}`;
  };

  const handleDownloadTicket = (bookingId: string, includeQR: boolean = false) => {
    const qrData = includeQR ? generateQRCode(bookingId) : '';
    const ticketContent = includeQR 
      ? `Digital Ticket for booking ${bookingId}\nQR Code: ${qrData}\nValid for entry`
      : `Ticket for booking ${bookingId}`;
    
    const link = document.createElement('a');
    link.href = `data:text/plain,${encodeURIComponent(ticketContent)}`;
    link.download = `ticket-${bookingId}${includeQR ? '-digital' : ''}.txt`;
    link.click();
  };

  const handleViewQR = (bookingId: string) => {
    const qrCode = generateQRCode(bookingId);
    setShowQR(qrCode);
  };

  const getEventById = (eventId: string) => {
    return events.find(event => event.id === eventId);
  };

  if (bookings.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Past Bookings</h3>
        <p className="text-gray-600 dark:text-gray-400">
          You haven't attended any events yet. Start booking to build your event history!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Past Bookings</h2>
        <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full dark:bg-gray-900 dark:text-gray-200">
          {bookings.length} Events Attended
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bookings.map((booking) => {
          const event = getEventById(booking.eventId);
          if (!event) return null;
          
          return (
          <div key={booking.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 opacity-90">
            {/* Event Poster */}
            <div className="relative">
              <img
                src={event.poster}
                alt={event.title}
                className="w-full h-48 object-cover grayscale"
              />
              <div className="absolute top-4 right-4">
                <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  ATTENDED
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
              </div>

              {/* Price */}
              <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Amount Paid</span>
                <span className="text-lg font-bold text-gray-600 dark:text-gray-400">
                  ${booking.totalAmount}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewQR(booking.id)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  <QrCode className="h-4 w-4" />
                  <span className="text-sm font-medium">View QR</span>
                </button>
                <button
                  onClick={() => handleDownloadTicket(booking.id, true)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  <Download className="h-4 w-4" />
                  <span className="text-sm font-medium">Digital Ticket</span>
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
        )})}
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
                        className="w-20 h-30 object-cover rounded-lg grayscale"
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
                            <span className="ml-2 px-2 py-1 rounded text-xs bg-gray-500 text-white">
                              ATTENDED
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
                          <span className="text-gray-600 dark:text-gray-400">
                            ${booking.totalAmount}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button
                        onClick={() => {
                          handleViewQR(booking.id);
                          setSelectedBooking(null);
                        }}
                        className="flex-1 flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors duration-200"
                      >
                        <QrCode className="h-5 w-5" />
                        <span>View QR Code</span>
                      </button>
                      <button
                        onClick={() => {
                          handleDownloadTicket(booking.id, true);
                          setSelectedBooking(null);
                        }}
                        className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors duration-200"
                      >
                        <Download className="h-5 w-5" />
                        <span>Download Ticket</span>
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full text-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Digital Ticket QR Code</h3>
            <div className="bg-gray-100 dark:bg-gray-700 p-8 rounded-lg mb-4">
              <div className="w-32 h-32 mx-auto bg-black rounded-lg flex items-center justify-center">
                <QrCode className="h-16 w-16 text-white" />
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Show this QR code at the venue for entry
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  const booking = bookings.find(b => b.id === selectedBooking);
                  if (booking) {
                    handleDownloadTicket(booking.id, true);
                  }
                  setShowQR(null);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Download
              </button>
              <button
                onClick={() => setShowQR(null)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PastBookings;