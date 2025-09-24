import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, User, Menu, X, Ticket, Search, ChevronDown, LogIn, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [openDropdown, setOpenDropdown] = React.useState<null | 'categories' | 'events' | 'user' | 'auth'>(null);
  const [isMobileAuthOpen, setIsMobileAuthOpen] = React.useState(false);
  const { token, role, logout } = useAuth();
  const isAuthenticated = !!token;
  const location = useLocation();
  const headerRef = React.useRef<HTMLDivElement | null>(null);

  const isActive = (path: string) => location.pathname === path;

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdowns on route change
  React.useEffect(() => {
    setOpenDropdown(null);
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  // Click-outside to close dropdowns
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (!headerRef.current) return;
      const target = e.target as Node;
      if (!headerRef.current.contains(target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const categories = [
    { name: 'Movies', href: '/movies' },
    { name: 'Concerts', href: '/concerts' },
    { name: 'Sports', href: '/sports' },
  ];

  const events = [
    { name: 'All Events', href: '/event' },
    { name: 'Trending', href: '/event?sort=trending' },
    { name: 'This Week', href: '/event?range=week' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 backdrop-blur supports-[backdrop-filter]:bg-opacity-80 ${
        scrolled
          ? isDarkMode
            ? 'bg-gray-900/80 shadow-lg'
            : 'bg-white/80 shadow-lg'
          : 'bg-gradient-to-r from-purple-600/10 via-fuchsia-600/10 to-indigo-600/10'
      }`}
      role="navigation"
    >
      <div ref={headerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 pr-4 md:pr-6">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 shadow-sm">
                <Ticket className="h-5 w-5 text-white" />
              </div>
              <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                TicketHub
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 lg:gap-8 xl:gap-10">
            <Link
              to="/"
              className={`px-2 text-sm font-medium transition-colors duration-200 ${
                isActive('/')
                  ? isDarkMode
                    ? 'text-purple-400'
                    : 'text-purple-600'
                  : isDarkMode
                  ? 'text-gray-300 hover:text-white'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Home
            </Link>

            {/* Events Dropdown */}
            <div className="relative" role="presentation">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'events' ? null : 'events')}
                onMouseEnter={() => setOpenDropdown('events')}
                onMouseLeave={() => setOpenDropdown(null)}
                onKeyDown={(e) => { if (e.key === 'Escape') setOpenDropdown(null); if (e.key === 'Enter' || e.key === ' ') setOpenDropdown(openDropdown === 'events' ? null : 'events'); }}
                aria-haspopup="menu"
                aria-expanded={openDropdown === 'events'}
                aria-controls="events-menu"
                className={`px-2 flex items-center gap-1 text-sm font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none ${
                  isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Events <ChevronDown className="h-4 w-4" />
              </button>
              <AnimatePresence>
                {openDropdown === 'events' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    id="events-menu"
                    role="menu"
                    className={`absolute left-0 mt-2 w-52 rounded-lg shadow-lg border ${
                      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}
                    onMouseEnter={() => setOpenDropdown('events')}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <div className="py-2">
                      {events.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`block px-4 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none ${
                            isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                          }`}
                          role="menuitem"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Categories Dropdown */}
            <div className="relative" role="presentation">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'categories' ? null : 'categories')}
                onMouseEnter={() => setOpenDropdown('categories')}
                onMouseLeave={() => setOpenDropdown(null)}
                onKeyDown={(e) => { if (e.key === 'Escape') setOpenDropdown(null); if (e.key === 'Enter' || e.key === ' ') setOpenDropdown(openDropdown === 'categories' ? null : 'categories'); }}
                aria-haspopup="menu"
                aria-expanded={openDropdown === 'categories'}
                aria-controls="categories-menu"
                className={`px-2 flex items-center gap-1 text-sm font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none ${
                  isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Categories <ChevronDown className="h-4 w-4" />
              </button>
              <AnimatePresence>
                {openDropdown === 'categories' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    id="categories-menu"
                    role="menu"
                    className={`absolute left-0 mt-2 w-56 rounded-lg shadow-lg border ${
                      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}
                    onMouseEnter={() => setOpenDropdown('categories')}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <div className="py-2">
                      {categories.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`block px-4 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none ${
                            isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                          }`}
                          role="menuitem"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/about"
              className={`px-2 text-sm font-medium transition-colors duration-200 ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`px-2 text-sm font-medium transition-colors duration-200 ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Search (desktop - show on xl+ to avoid crowding) */}
          <div className="hidden xl:flex flex-1 justify-center px-6">
            <div className={`relative w-full max-w-md ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search events, venues..."
                className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  isDarkMode ? 'bg-gray-800 border-gray-700 placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-400'
                }`}
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {/* Search (mobile) */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors duration-200 ${
                isDarkMode ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              aria-label="Open search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                isDarkMode ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Auth Actions */}
            {!isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2 relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'auth' ? null : 'auth')}
                  className={`inline-flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium border transition ${
                    isDarkMode ? 'text-gray-200 border-gray-700 hover:bg-gray-800' : 'text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                  aria-haspopup="menu"
                  aria-expanded={openDropdown === 'auth'}
                >
                  <LogIn className="h-4 w-4" /> Login
                </button>
                <AnimatePresence>
                  {openDropdown === 'auth' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className={`absolute right-0 top-10 w-40 rounded-lg shadow-lg border ${
                        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                      }`}
                      role="menu"
                    >
                      <Link
                        to="/login"
                        onClick={() => setOpenDropdown(null)}
                        className={`block px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}
                        role="menuitem"
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setOpenDropdown(null)}
                        className={`block px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}
                        role="menuitem"
                      >
                        <span className="inline-flex items-center gap-2"><UserPlus className="h-4 w-4" /> Sign Up</span>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'user' ? null : 'user')}
                  className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-medium ${
                    isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <User className="h-5 w-5" />
                </button>
                <AnimatePresence>
                  {openDropdown === 'user' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className={`absolute right-0 mt-2 w-44 rounded-lg shadow-lg border ${
                        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                      }`}
                    >
                      {role === 'ADMIN' ? (
                        <Link to="/admin-dashboard" className={`block px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}>Admin Dashboard</Link>
                      ) : (
                        <Link to="/user-dashboard" className={`block px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}>My Tickets</Link>
                      )}
                      <Link to="/profile" className={`block px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}>Profile</Link>
                      <button onClick={logout} className={`w-full text-left px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}>Logout</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors duration-200 ${
                isDarkMode ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="lg:hidden pb-3"
            >
              <div className={`relative ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events, venues..."
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    isDarkMode ? 'bg-gray-800 border-gray-700 placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-400'
                  }`}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`lg:hidden border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}
            >
              <div className="py-3 space-y-1">
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-2 py-2 rounded-md text-sm font-medium ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  Home
                </Link>

                {/* Events accordion */}
                <details className="group">
                  <summary className={`flex items-center justify-between cursor-pointer px-2 py-2 rounded-md text-sm font-medium ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}>
                    <span className="flex items-center gap-1">Events</span>
                    <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="mt-1 pl-4">
                    {events.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`block px-2 py-2 rounded-md text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </details>

                {/* Categories accordion */}
                <details className="group">
                  <summary className={`flex items-center justify-between cursor-pointer px-2 py-2 rounded-md text-sm font-medium ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}>
                    <span className="flex items-center gap-1">Categories</span>
                    <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="mt-1 pl-4">
                    {categories.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`block px-2 py-2 rounded-md text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </details>

                <Link
                  to="/about"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-2 py-2 rounded-md text-sm font-medium ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-2 py-2 rounded-md text-sm font-medium ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  Contact
                </Link>

                {!isAuthenticated ? (
                  <div className="pt-2">
                    <button
                      onClick={() => setIsMobileAuthOpen(!isMobileAuthOpen)}
                      className={`w-full inline-flex items-center justify-center gap-1 px-3 py-2 rounded-md text-sm font-medium border ${isDarkMode ? 'text-gray-200 border-gray-700 hover:bg-gray-800' : 'text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                    >
                      <LogIn className="h-4 w-4" /> Login
                    </button>
                    <AnimatePresence>
                      {isMobileAuthOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.15, ease: 'easeOut' }}
                          className="mt-2"
                        >
                          <Link
                            to="/login"
                            onClick={() => {
                              setIsMenuOpen(false);
                              setIsMobileAuthOpen(false);
                            }}
                            className={`block w-full text-center px-3 py-2 rounded-md text-sm font-medium mb-2 ${isDarkMode ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                          >
                            Go to Login
                          </Link>
                          <Link
                            to="/signup"
                            onClick={() => {
                              setIsMenuOpen(false);
                              setIsMobileAuthOpen(false);
                            }}
                            className="block w-full text-center px-3 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
                          >
                            Sign Up
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : null}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;