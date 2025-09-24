import React, { useState } from 'react';
import { Seat } from '../../types';
import { Info, Users } from 'lucide-react';

interface SeatingChartProps {
  seats: Seat[];
  selectedSeats: string[];
  onSeatSelect: (seatId: string) => void;
  priceTiers: {
    regular: number;
    vip: number;
    premium: number;
  };
}

const SeatingChart: React.FC<SeatingChartProps> = ({ 
  seats, 
  selectedSeats, 
  onSeatSelect, 
  priceTiers 
}) => {
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);

  // Group seats by row
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  // Sort rows and seats within each row
  const sortedRows = Object.keys(seatsByRow).sort();
  const sortedSeatsByRow = sortedRows.map(row => ({
    row,
    seats: seatsByRow[row].sort((a, b) => a.number - b.number)
  }));

  const getSeatColor = (seat: Seat) => {
    if (seat.status === 'booked') {
      return 'bg-red-500 hover:bg-red-600 cursor-not-allowed';
    }
    if (selectedSeats.includes(seat.id)) {
      return 'bg-green-500 hover:bg-green-600 ring-2 ring-green-300';
    }
    switch (seat.type) {
      case 'premium':
        return 'bg-yellow-400 hover:bg-yellow-500 cursor-pointer';
      case 'vip':
        return 'bg-purple-400 hover:bg-purple-500 cursor-pointer';
      case 'regular':
      default:
        return 'bg-blue-400 hover:bg-blue-500 cursor-pointer';
    }
  };

  const getSeatPrice = (seat: Seat) => {
    return priceTiers[seat.type] || 0;
  };

  const getLegendColor = (type: string) => {
    switch (type) {
      case 'available-regular': return 'bg-blue-400';
      case 'available-vip': return 'bg-purple-400';
      case 'available-premium': return 'bg-yellow-400';
      case 'selected': return 'bg-green-500';
      case 'booked': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Info className="h-5 w-5 mr-2" />
          Seat Legend
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-400 rounded border-2 border-gray-300"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Regular (${priceTiers.regular})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-purple-400 rounded border-2 border-gray-300"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">VIP (${priceTiers.vip})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-yellow-400 rounded border-2 border-gray-300"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Premium (${priceTiers.premium})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-green-500 rounded border-2 border-gray-300"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Selected</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-red-500 rounded border-2 border-gray-300"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Booked</span>
          </div>
        </div>
      </div>

      {/* Screen */}
      <div className="text-center mb-8">
        <div className="bg-gradient-to-r from-gray-600 to-gray-800 text-white py-3 px-8 rounded-t-full mx-auto inline-block shadow-lg">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span className="font-semibold">SCREEN</span>
          </div>
        </div>
      </div>

      {/* Seating Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg overflow-x-auto">
        <div className="min-w-max">
          {sortedSeatsByRow.map(({ row, seats: rowSeats }) => (
            <div key={row} className="flex items-center justify-center mb-4 space-x-2">
              {/* Row Label */}
              <div className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded font-semibold text-gray-700 dark:text-gray-300 mr-4">
                {row}
              </div>
              
              {/* Seats */}
              <div className="flex space-x-2">
                {rowSeats.map((seat) => (
                  <button
                    key={seat.id}
                    onClick={() => seat.status === 'available' && onSeatSelect(seat.id)}
                    onMouseEnter={() => setHoveredSeat(seat.id)}
                    onMouseLeave={() => setHoveredSeat(null)}
                    disabled={seat.status === 'booked'}
                    className={`w-10 h-10 rounded border-2 border-gray-300 transition-all duration-200 flex items-center justify-center text-xs font-bold text-white relative ${
                      getSeatColor(seat)
                    } ${hoveredSeat === seat.id && seat.status === 'available' ? 'scale-110 z-10' : ''}`}
                    title={`${seat.row}${seat.number} - ${seat.type} - $${getSeatPrice(seat)}`}
                  >
                    {seat.number}
                    
                    {/* Tooltip */}
                    {hoveredSeat === seat.id && seat.status === 'available' && (
                      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap z-20">
                        {seat.row}{seat.number} - ${getSeatPrice(seat)}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Aisle Indicators */}
      <div className="flex justify-center space-x-8 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-1 bg-gray-400 rounded"></div>
          <span>Aisle</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-1 bg-blue-400 rounded"></div>
          <span>Regular Section</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-1 bg-purple-400 rounded"></div>
          <span>VIP Section</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-1 bg-yellow-400 rounded"></div>
          <span>Premium Section</span>
        </div>
      </div>
    </div>
  );
};

export default SeatingChart;