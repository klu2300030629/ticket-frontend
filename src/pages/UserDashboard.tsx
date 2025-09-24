import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import UpcomingBookings from '../components/user/UpcomingBookings';
import PastBookings from '../components/user/PastBookings';
import ProfileSettings from '../components/user/ProfileSettings';
import { Booking, Event } from '../types';
import { User, Settings, LogOut, Ticket, History } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const UserDashboard: React.FC = () => {
  const { darkMode: isDarkMode } = useTheme();
  const navigate = useNavigate();
  const { token, user: authUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'profile'>('upcoming');
  const [events, setEvents] = useState<Event[]>([]);
  const [user, setUser] = useState<{ id?: number; fullName?: string; email?: string } | null>({});
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        // Fetch user details
        const userRes = await fetch('http://localhost:8080/user/details', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (userRes.ok) {
          const u = await userRes.json();
          setUser(u);
          // Fetch bookings for user
          const bRes = await fetch(`http://localhost:8080/api/users/${u.id}/bookings`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (bRes.ok) {
            const list = await bRes.json();
            // Map backend BookingResponse to frontend Booking shape minimally
            const mapped: Booking[] = (list || []).map((b: any) => ({
              id: String(b.id),
              userId: String(b.userId),
              eventId: String(b.eventId),
              seats: [],
              totalAmount: Number(b.totalAmount || 0),
              status: (b.status || 'confirmed').toLowerCase(),
              bookingDate: b.createdAt || '',
              paymentMethod: 'card'
            }));
            setUpcomingBookings(mapped.filter(m => m.status === 'confirmed'));
            setPastBookings(mapped.filter(m => m.status !== 'confirmed'));
          }
        }
        // Fetch events for mapping
        const eRes = await fetch('http://localhost:8080/api/events');
        if (eRes.ok) {
          const data = await eRes.json();
          const mappedEvents: Event[] = (data || []).map((e: any) => ({
            id: String(e.id),
            title: e.title,
            description: e.description,
            category: (e.category || 'movies') as any,
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
          setEvents(mappedEvents);
        }
      } catch (err) {
        console.error('Failed loading dashboard data', err);
      }
    };
    if (token) load();
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // const handleProfileUpdate = (updatedUser: any) => { setUser(updatedUser); };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'upcoming':
        return <UpcomingBookings bookings={upcomingBookings} events={events} />;
      case 'past':
        return <PastBookings bookings={pastBookings} events={events} />;
      case 'profile':
        return user ? (
          <ProfileSettings user={{
            id: String(user.id || ''),
            name: user.fullName || authUser?.fullName || '',
            email: user.email || authUser?.email || '',
            phone: '',
            address: '',
            preferences: { notifications: true, newsletter: false, smsAlerts: false },
            paymentMethods: []
          }} />
        ) : null;
      default:
        return <UpcomingBookings bookings={upcomingBookings} events={events} />;
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {user?.fullName || authUser?.fullName || authUser?.email}
                  </h1>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {user?.email || authUser?.email}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 sticky top-8`}>
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                Dashboard
              </h2>
              
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                    activeTab === 'upcoming'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
                  }`}
                >
                  <Ticket className="h-5 w-5" />
                  <span>Upcoming Bookings</span>
                  <span className={`ml-auto text-xs ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'} px-2 py-1 rounded-full`}>
                    {upcomingBookings.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('past')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                    activeTab === 'past'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
                  }`}
                >
                  <History className="h-5 w-5" />
                  <span>Past Bookings</span>
                  <span className={`ml-auto text-xs ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'} px-2 py-1 rounded-full`}>
                    {pastBookings.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                    activeTab === 'profile'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  <span>Profile Settings</span>
                </button>
              </nav>

              {/* Quick Stats */}
              <div className={`mt-8 pt-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-4`}>
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Total Events</span>
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {upcomingBookings.length + pastBookings.length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Total Spent</span>
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      $\{[...upcomingBookings, ...pastBookings].reduce((sum, booking) => sum + booking.totalAmount, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                     <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Avg. Rating</span>
                     <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                       4.7 ⭐
                     </span>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;