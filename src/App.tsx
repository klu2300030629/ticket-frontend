import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import CheckoutPage from './pages/CheckoutPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import MovieEventsPage from './pages/MovieEventsPage';
import ConcertEventsPage from './pages/ConcertEventsPage';
import SportEventsPage from './pages/SportEventsPage';
import About from './pages/About';
import Contact from './pages/Contact';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoadingProvider } from './contexts/LoadingContext';
import PageTransition from './components/animations/PageTransition';
import RequireAuth from './components/auth/RequireAuth';
import RequireRole from './components/auth/RequireRole';
import RoleBasedRedirect from './components/auth/RoleBasedRedirect';

function App() {
  // We'll use the ThemeProvider's context instead of managing state here

  return (
    <ThemeProvider>
      <AuthProvider>
        <LoadingProvider>
          <Router>
            <AppContent />
          </Router>
        </LoadingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Separate component to use the ThemeContext
const AppContent = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  
  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Header isDarkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main id="main-content" className="min-h-screen" tabIndex={-1}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
            <Route path="/event" element={<PageTransition><EventsPage /></PageTransition>} />
            <Route path="/event/:id" element={<PageTransition><EventDetailsPage /></PageTransition>} />
            <Route path="/event/:id/seats" element={<RequireAuth><PageTransition><SeatSelectionPage /></PageTransition></RequireAuth>} />
            <Route path="/checkout" element={<RequireAuth><PageTransition><CheckoutPage /></PageTransition></RequireAuth>} />
            <Route path="/login" element={<PageTransition>{React.createElement(require('./pages/Login').default)}</PageTransition>} />
            <Route path="/signup" element={<PageTransition>{React.createElement(require('./pages/Signup').default)}</PageTransition>} />
            <Route path="/user-dashboard" element={<RoleBasedRedirect allowedRoles={['USER']}><PageTransition><UserDashboard /></PageTransition></RoleBasedRedirect>} />
            <Route path="/admin-dashboard" element={<RoleBasedRedirect allowedRoles={['ADMIN']}><PageTransition><AdminDashboard /></PageTransition></RoleBasedRedirect>} />
            <Route path="/movies" element={<PageTransition><MovieEventsPage /></PageTransition>} />
            <Route path="/concerts" element={<PageTransition><ConcertEventsPage /></PageTransition>} />
            <Route path="/sports" element={<PageTransition><SportEventsPage /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer isDarkMode={darkMode} />
    </div>
  );
}

export default App;
