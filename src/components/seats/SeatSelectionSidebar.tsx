import React from 'react';
import { Seat } from '../../types';
import { Clock, MapPin, DollarSign, Users, X } from 'lucide-react';

interface SeatSelectionSidebarProps {
  event: {
    title: string;
    date: string;
    time: string;
    venue: string;
    poster: string;
  };
  selectedSeats: Seat[];
  priceTiers: {
    regular: number;
    vip: number;
    premium: number;
  };
  onRemoveSeat: (seatId: string) => void;
  onProceedToCheckout: () => void;
}

const SeatSelectionSidebar: React.FC<SeatSelectionSidebarProps> = ({
  event,
  selectedSeats,
  priceTiers,
  onRemoveSeat,
  onProceedToCheckout
}) => {
  const getSeatPrice = (seat: Seat) => {
    return priceTiers[seat.type] || 0;
  };

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + getSeatPrice(seat), 0);
  const convenienceFee = Math.round(totalPrice * 0.05); // 5% convenience fee
  const finalTotal = totalPrice + convenienceFee;

  const getSeatTypeColor = (type: string) => {
    switch (type) {
      case 'vip': return 'text-purple-600 dark:text-purple-400';
      case 'premium': return 'text-yellow-600 dark:text-yellow-400';
      case 'regular':
      default: return 'text-blue-600 dark:text-blue-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-4">
      {/* Event Info */}
      <div className="mb-6">
        <div className="flex items-start space-x-4">
          <img 
            src={event.poster} 
            alt={event.title}
            className="w-16 h-24 object-cover rounded-lg shadow-md"
          />
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 line-clamp-2">
              {event.title}
            </h3>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{event.date} • {event.time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span className="line-clamp-1">{event.venue}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Seats */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Selected Seats ({selectedSeats.length})
          </h4>
          {selectedSeats.length > 0 && (
            <button
              onClick={() => selectedSeats.forEach(seat => onRemoveSeat(seat.id))}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              Clear All
            </button>
          )}
        </div>

        {selectedSeats.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No seats selected</p>
            <p className="text-xs mt-1">Click on seats to add them</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {selectedSeats.map((seat) => (
              <div
                key={seat.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    seat.type === 'vip' ? 'bg-purple-400' :
                    seat.type === 'premium' ? 'bg-yellow-400' :
                    'bg-blue-400'
                  }`}></div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {seat.row}{seat.number}
                    </div>
                    <div className={`text-sm font-medium ${getSeatTypeColor(seat.type)}`}>
                      {seat.type.toUpperCase()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-gray-900 dark:text-white">
                    ${getSeatPrice(seat)}
                  </span>
                  <button
                    onClick={() => onRemoveSeat(seat.id)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price Breakdown */}
      {selectedSeats.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <DollarSign className="h-4 w-4 mr-2" />
            Price Breakdown
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
              <span className="font-medium text-gray-900 dark:text-white">${totalPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Convenience Fee (5%)</span>
              <span className="font-medium text-gray-900 dark:text-white">${convenienceFee}</span>
            </div>
            <div className="border-t border-gray-300 dark:border-gray-600 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                <span className="font-bold text-lg text-green-600 dark:text-green-400">${finalTotal}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={onProceedToCheckout}
          disabled={selectedSeats.length === 0}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
            selectedSeats.length > 0
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          {selectedSeats.length === 0 
            ? 'Select Seats to Continue' 
            : `Proceed to Checkout • $${finalTotal}`
          }
        </button>
        
        <button
          onClick={() => window.history.back()}
          className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          Back to Event Details
        </button>
      </div>

      {/* Terms */}
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
        <p>By proceeding, you agree to our terms and conditions</p>
        <p className="mt-1">Tickets are non-refundable</p>
      </div>
    </div>
  );
};

export default SeatSelectionSidebar;