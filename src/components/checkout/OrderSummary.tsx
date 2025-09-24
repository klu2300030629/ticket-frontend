import React from 'react';
import { motion } from 'framer-motion';
import { Seat } from '../../types';
import { X, Ticket, Calendar, MapPin, Clock } from 'lucide-react';

interface OrderSummaryProps {
  event: {
    title: string;
    date: string;
    time: string;
    venue: string;
    poster: string;
    price: {
      regular: number;
      vip: number;
      premium: number;
    };
  };
  selectedSeats: Seat[];
  onRemoveSeat: (seatId: string) => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  event,
  selectedSeats,
  onRemoveSeat
}) => {
  const getSeatPrice = (seat: Seat) => {
    return seat.price || event.price[seat.type] || 0;
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
    <section className="relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/0 via-indigo-50 to-pink-50 dark:from-transparent dark:via-gray-900 dark:to-black" />
      <div className="rounded-2xl p-4 sm:p-6 bg-white/70 dark:bg-white/5 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Event & Seats */}
          <div>
            {/* Event Info */}
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="mb-6 pb-4 border-b border-gray-200 dark:border-white/10">
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
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(event.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3 w-3" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-3 w-3" />
                      <span className="line-clamp-1">{event.venue}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Selected Seats */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                  <Ticket className="h-4 w-4 mr-2" />
                  Selected Seats ({selectedSeats.length})
                </h4>
              </div>

              {selectedSeats.length === 0 ? (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                  <p className="text-sm">No seats selected</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedSeats.map((seat, idx) => (
                    <motion.div
                      key={seat.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.25, delay: idx * 0.03 }}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between p-3 bg-gray-50/70 dark:bg-white/5 rounded-lg ring-1 ring-black/5 dark:ring-white/10"
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
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Summary */}
          <div className="lg:pl-2">
            <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-white/10">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-medium text-gray-900 dark:text-white">${totalPrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Convenience Fee (5%)</span>
                <span className="font-medium text-gray-900 dark:text-white">${convenienceFee}</span>
              </div>
              <div className="relative overflow-hidden rounded-xl">
                <motion.div
                  initial={{ y: '100%' }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-10"
                />
                <div className="relative flex justify-between items-center text-lg font-bold pt-2 border-t border-gray-200 dark:border-white/10">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-green-600 dark:text-green-400">${finalTotal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderSummary;