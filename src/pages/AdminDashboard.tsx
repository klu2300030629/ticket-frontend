import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Calendar, DollarSign, Settings, User as UserIcon, LogOut, TrendingUp, Eye, EyeOff } from 'lucide-react';
import AnalyticsDashboard from '../components/admin/AnalyticsDashboard';
import EventManagement from '../components/admin/EventManagement';
import UserManagement from '../components/admin/UserManagement';
import { Event, User as TypesUser } from '../types';
import { useAuth } from '../contexts/AuthContext';

// Define AdminUser interface that extends the User interface from types
interface AdminUser extends Omit<TypesUser, 'preferences'> {
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'banned';
  joinDate: string;
  lastLogin: string;
  totalBookings: number;
  totalSpent: number;
  avatar: string;
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    language: string;
  };
}

// Extended Event interface for admin dashboard
interface AdminEvent extends Event {
  image?: string;
  reviews?: number;
  trending?: boolean;
  capacity?: number;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'events' | 'users' | 'settings'>('analytics');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const { token } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(false);

  // Handlers to keep local events state in sync after CRUD operations
  const handleEventCreate = (created: Omit<Event, 'id'>) => {
    // Convert to AdminEvent and add to state
    const adminEvent: AdminEvent = {
      ...created,
      id: `event_${Date.now()}`, // Generate temporary ID
      image: created.poster,
      reviews: 0,
      trending: false,
      capacity: created.totalSeats
    };
    setEvents(prev => [adminEvent, ...prev]);
  };

  const handleEventUpdate = (updated: Event) => {
    // Convert to AdminEvent and update state
    const adminEvent: AdminEvent = {
      ...updated,
      image: updated.poster,
      reviews: updated.rating || 0,
      trending: false,
      capacity: updated.totalSeats
    };
    setEvents(prev => prev.map(e => (e.id === updated.id ? { ...e, ...adminEvent } : e)));
  };

  const handleEventDelete = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        const response = await fetch('http://52.91.141.5:7070/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error('Failed to fetch users');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [token]);

  // Fetch events data
  useEffect(() => {
    const fetchEvents = async () => {
      if (!token) return;
      
      try {
        setEventsLoading(true);
        const response = await fetch('http://52.91.141.5:7070/api/admin/events', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else {
          console.error('Failed to fetch events');
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setEventsLoading(false);
      }
    };
    
    fetchEvents();
  }, [token]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, you would also update the theme in the context/store
  };

  // Toggle stats visibility
  const toggleStats = () => {
    setShowStats(!showStats);
  };

  // Handle logout
  const handleLogout = () => {
    // Implement logout functionality
    console.log('Logging out...');
  };

  return (
    <div className={`flex h-screen bg-gray-100 ${isDarkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Admin Dashboard</h2>
        </div>
        <nav className="mt-4">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center w-full px-4 py-3 ${
              activeTab === 'analytics'
                ? 'bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            <BarChart3 className="mr-3 h-5 w-5" />
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`flex items-center w-full px-4 py-3 ${
              activeTab === 'events'
                ? 'bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            <Calendar className="mr-3 h-5 w-5" />
            Events
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center w-full px-4 py-3 ${
              activeTab === 'users'
                ? 'bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            <Users className="mr-3 h-5 w-5" />
            Users
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center w-full px-4 py-3 ${
              activeTab === 'settings'
                ? 'bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </button>
        </nav>
        <div className="absolute bottom-0 w-64 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={toggleDarkMode}
            className="flex items-center w-full px-4 py-3 text-gray-600 dark:text-gray-300"
          >
            {isDarkMode ? <Eye className="mr-3 h-5 w-5" /> : <EyeOff className="mr-3 h-5 w-5" />}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-gray-600 dark:text-gray-300"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex justify-between items-center px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
              {activeTab === 'analytics' && 'Analytics Dashboard'}
              {activeTab === 'events' && 'Event Management'}
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'settings' && 'Settings'}
            </h1>
            <div className="flex items-center">
              {activeTab === 'analytics' && (
                <button
                  onClick={toggleStats}
                  className="flex items-center px-3 py-1 mr-4 text-sm bg-gray-100 dark:bg-gray-700 rounded-md"
                >
                  {showStats ? <TrendingUp className="mr-1 h-4 w-4" /> : <EyeOff className="mr-1 h-4 w-4" />}
                  {showStats ? 'Hide Stats' : 'Show Stats'}
                </button>
              )}
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <UserIcon className="h-5 w-5" />
                </div>
                <span className="ml-2 text-gray-700 dark:text-gray-300">Admin</span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {activeTab === 'analytics' && <AnalyticsDashboard events={events} users={users} />}
          {activeTab === 'events' && <EventManagement 
            events={events} 
            onEventUpdate={handleEventUpdate}
            onEventDelete={handleEventDelete}
            onEventCreate={handleEventCreate}
            loading={eventsLoading}
          />}
          {activeTab === 'users' && <UserManagement 
            users={users} 
            onUserUpdate={(user) => console.log('Update user:', user)}
            onUserDelete={(userId) => console.log('Delete user:', userId)}
            onUserStatusChange={(userId, status) => console.log('Change status:', userId, status)}
            loading={loading} 
          />}
          {activeTab === 'settings' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Settings</h2>
              <p className="text-gray-600 dark:text-gray-300">Admin settings will be implemented here.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
