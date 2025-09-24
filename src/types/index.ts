export interface Event {
  id: string;
  title: string;
  description: string;
  category: 'movies' | 'concerts' | 'sports';
  date: string;
  time: string;
  venue: string;
  poster: string;
  price: {
    regular: number;
    vip: number;
    premium: number;
  };
  availableSeats: number;
  totalSeats: number;
  rating?: number;
  tags: string[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  type: 'regular' | 'vip' | 'premium';
  status: 'available' | 'booked' | 'selected';
  price: number;
}

export interface Booking {
  id: string;
  eventId: string;
  userId: string;
  seats: Seat[];
  totalAmount: number;
  bookingDate: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  paymentMethod: string;
  qrCode?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role?: 'user' | 'admin';
  status?: 'active' | 'inactive' | 'banned';
  joinDate?: string;
  lastLogin?: string;
  totalBookings?: number;
  totalSpent?: number;
  avatar?: string;
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    language: string;
  };
}