import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, Calendar, Eye, ShoppingCart, Star, Clock } from 'lucide-react';
import { Event, User } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface AnalyticsData {
  totalRevenue: number;
  totalBookings: number;
  totalUsers: number;
  activeEvents: number;
  revenueGrowth: number;
  bookingGrowth: number;
  userGrowth: number;
  eventGrowth: number;
  topEvents: Array<{
    id: string;
    title: string;
    revenue: number;
    bookings: number;
  }>;
  categoryDistribution: Array<{
    category: string;
    count: number;
    revenue: number;
  }>;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    bookings: number;
  }>;
  recentBookings: Array<{
    id: string;
    eventTitle: string;
    userName: string;
    amount: number;
    date: string;
    status: string;
  }>;
}

interface AnalyticsDashboardProps {
  events: Event[];
  users: User[];
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ events, users }) => {
  const [timeRange, setTimeRange] = useState('7d');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    const darkModePreference = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkModePreference);
  }, []);

  // Fetch bookings data
  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        const response = await fetch('http://52.91.141.5:7070/api/admin/bookings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        } else {
          console.error('Failed to fetch bookings');
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, [token]);

  // Generate analytics data from events, users and bookings
  useEffect(() => {
    if (!events.length || !users.length) return;

    // Calculate total revenue from bookings or estimate from events if no bookings
    const totalRevenue = bookings.length > 0 
      ? bookings.reduce((sum, booking) => sum + booking.totalAmount, 0)
      : events.reduce((sum, event) => sum + (event.price.regular * event.totalSeats * 0.7 + event.price.vip * event.totalSeats * 0.2 + event.price.premium * event.totalSeats * 0.1), 0);
    
    // Get recent bookings
    const recentBookings = bookings.length > 0 
      ? bookings
          .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
          .slice(0, 5)
          .map(booking => {
            const event = events.find(e => e.id === booking.eventId) || { title: 'Unknown Event' };
            const user = users.find(u => u.id === booking.userId) || { name: 'Unknown User' };
            return {
              id: booking.id,
              eventTitle: event.title,
              userName: user.name,
              amount: booking.totalAmount,
              date: booking.bookingDate,
              status: booking.status
            };
          })
      : [];

    // Generate monthly revenue data
    const currentDate = new Date();
    const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
      const monthIndex = (currentDate.getMonth() - 5 + i) % 12;
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = monthNames[monthIndex];
      
      // Filter bookings for this month
      const monthBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.bookingDate);
        return bookingDate.getMonth() === monthIndex;
      });
      
      return {
        month,
        revenue: monthBookings.reduce((sum, booking) => sum + booking.totalAmount, 0) || Math.floor(Math.random() * 30000) + 40000, // Fallback to random data if no bookings
        bookings: monthBookings.length || Math.floor(Math.random() * 50) + 100 // Fallback to random data if no bookings
      };
    });

    const data: AnalyticsData = {
      totalRevenue,
      totalBookings: bookings.length || events.reduce((sum, event) => sum + (event.totalSeats - event.availableSeats), 0),
      totalUsers: users.length,
      activeEvents: events.filter(event => event.status === 'upcoming' || event.status === 'ongoing').length,
      revenueGrowth: 12.5, // Could calculate from historical data if available
      bookingGrowth: 8.3, // Could calculate from historical data if available
      userGrowth: 15.2, // Could calculate from historical data if available
      eventGrowth: 5.7, // Could calculate from historical data if available
      topEvents: events
        .sort((a, b) => ((b.totalSeats - b.availableSeats) - (a.totalSeats - a.availableSeats)))
        .slice(0, 5)
        .map(event => ({
          id: event.id,
          title: event.title,
          revenue: event.price.regular * (event.totalSeats - event.availableSeats) * 0.7 + 
                  event.price.vip * (event.totalSeats - event.availableSeats) * 0.2 + 
                  event.price.premium * (event.totalSeats - event.availableSeats) * 0.1,
          bookings: event.totalSeats - event.availableSeats
        })),
      categoryDistribution: [
        { category: 'Concerts', count: events.filter(e => e.category === 'concerts').length, revenue: events.filter(e => e.category === 'concerts').reduce((sum, e) => sum + (e.price.regular * (e.totalSeats - e.availableSeats) * 0.7 + e.price.vip * (e.totalSeats - e.availableSeats) * 0.2 + e.price.premium * (e.totalSeats - e.availableSeats) * 0.1), 0) },
        { category: 'Sports', count: events.filter(e => e.category === 'sports').length, revenue: events.filter(e => e.category === 'sports').reduce((sum, e) => sum + (e.price.regular * (e.totalSeats - e.availableSeats) * 0.7 + e.price.vip * (e.totalSeats - e.availableSeats) * 0.2 + e.price.premium * (e.totalSeats - e.availableSeats) * 0.1), 0) },
        { category: 'Movies', count: events.filter(e => e.category === 'movies').length, revenue: events.filter(e => e.category === 'movies').reduce((sum, e) => sum + (e.price.regular * (e.totalSeats - e.availableSeats) * 0.7 + e.price.vip * (e.totalSeats - e.availableSeats) * 0.2 + e.price.premium * (e.totalSeats - e.availableSeats) * 0.1), 0) }
      ].filter(cat => cat.count > 0),
      monthlyRevenue,
      recentBookings: recentBookings.length > 0 ? recentBookings : [
        { id: '1', eventTitle: 'No recent bookings', userName: '-', amount: 0, date: '-', status: '-' }
      ]
    };

    setAnalyticsData(data);
  }, [events, users, bookings]);

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    change: number;
    changeType: 'positive' | 'negative' | 'neutral';
  }> = ({ title, value, icon, change, changeType }) => (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {title}
          </p>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-full ${
          changeType === 'positive' ? 'bg-green-100 text-green-600' :
          changeType === 'negative' ? 'bg-red-100 text-red-600' :
          'bg-gray-100 text-gray-600'
        }`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span className={`text-sm font-medium ${
          changeType === 'positive' ? 'text-green-600' :
          changeType === 'negative' ? 'text-red-600' :
          'text-gray-600'
        }`}>
          {change > 0 ? '+' : ''}{change}%
        </span>
        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} ml-2`}>
          vs last period
        </span>
      </div>
    </div>
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">Monitor your platform performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 animate-pulse`}>
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-4"></div>
              <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            </div>
          ))
        ) : analyticsData ? (
          <>
            <StatCard
              title="Total Revenue"
              value={formatCurrency(analyticsData.totalRevenue)}
              icon={<DollarSign className="h-6 w-6" />}
              change={analyticsData.revenueGrowth}
              changeType={analyticsData.revenueGrowth >= 0 ? 'positive' : 'negative'}
            />
            <StatCard
              title="Total Bookings"
              value={formatNumber(analyticsData.totalBookings)}
              icon={<ShoppingCart className="h-6 w-6" />}
              change={analyticsData.bookingGrowth}
              changeType={analyticsData.bookingGrowth >= 0 ? 'positive' : 'negative'}
            />
            <StatCard
              title="Total Users"
              value={formatNumber(analyticsData.totalUsers)}
              icon={<Users className="h-6 w-6" />}
              change={analyticsData.userGrowth}
              changeType={analyticsData.userGrowth >= 0 ? 'positive' : 'negative'}
            />
            <StatCard
              title="Active Events"
              value={analyticsData.activeEvents}
              icon={<Calendar className="h-6 w-6" />}
              change={analyticsData.eventGrowth}
              changeType={analyticsData.eventGrowth >= 0 ? 'positive' : 'negative'}
            />
          </>
        ) : (
          <div className="col-span-4 text-center py-10">
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No analytics data available
            </p>
          </div>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Monthly Revenue Trend
          </h3>
          {loading ? (
            <div className="h-64 animate-pulse bg-gray-300 dark:bg-gray-600 rounded"></div>
          ) : analyticsData ? (
            <>
              <div className="h-64 flex items-end justify-between space-x-2">
                {analyticsData.monthlyRevenue.map((month, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-blue-600 rounded-t"
                      style={{
                        height: `${(month.revenue / Math.max(...analyticsData.monthlyRevenue.map(m => m.revenue))) * 200}px`,
                        minHeight: '20px'
                      }}
                    />
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                      {month.month.slice(0, 3)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Total: {formatCurrency(analyticsData.monthlyRevenue.reduce((sum, month) => sum + month.revenue, 0))}
                </span>
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Avg: {formatCurrency(analyticsData.monthlyRevenue.reduce((sum, month) => sum + month.revenue, 0) / analyticsData.monthlyRevenue.length)}
                </span>
              </div>
            </>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                No revenue data available
              </p>
            </div>
          )}
        </div>

        {/* Category Distribution */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Revenue by Category
          </h3>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : analyticsData && analyticsData.categoryDistribution.length > 0 ? (
            <div className="space-y-4">
              {analyticsData.categoryDistribution.map((category, index) => {
                const percentage = (category.revenue / analyticsData.totalRevenue) * 100;
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-green-500' :
                        index === 2 ? 'bg-yellow-500' :
                        index === 3 ? 'bg-red-500' :
                        index === 4 ? 'bg-purple-500' :
                        'bg-gray-500'
                      }`} />
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {category.category.charAt(0).toUpperCase() + category.category.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {formatCurrency(category.revenue)}
                      </span>
                      <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center">
              <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                No category data available
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Top Events and Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Events */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Top Performing Events
          </h3>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                    <div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16 mb-2"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : analyticsData && analyticsData.topEvents.length > 0 ? (
            <div className="space-y-4">
              {analyticsData.topEvents.map((event, index) => (
                <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {event.title}
                      </h4>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {event.bookings} bookings
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formatCurrency(event.revenue)}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Revenue
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center">
              <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                No top events data available
              </p>
            </div>
          )}
        </div>

        {/* Recent Bookings */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Recent Bookings
          </h3>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
                  </div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                </div>
              ))}
            </div>
          ) : analyticsData && analyticsData.recentBookings.length > 0 ? (
            <div className="space-y-4">
              {analyticsData.recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {booking.eventTitle}
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {booking.userName}
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {new Date(booking.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formatCurrency(booking.amount)}
                    </p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center">
              <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                No recent bookings available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
