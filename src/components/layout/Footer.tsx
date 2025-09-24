import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Ticket, Send, Youtube, Linkedin } from 'lucide-react';

interface FooterProps {
  isDarkMode: boolean;
}

const Footer: React.FC<FooterProps> = ({ isDarkMode }) => {
  const prefersReducedMotion = useReducedMotion();

  const getMotionProps = (delay: number) => prefersReducedMotion ? {} : ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-50px' },
    transition: { duration: 0.5, delay, ease: 'easeOut' }
  } as const);

  return (
    <footer className={`relative overflow-hidden border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
      <div className={`absolute inset-0 pointer-events-none ${isDarkMode ? 'bg-gradient-to-b from-transparent via-indigo-500/5 to-purple-500/10' : 'bg-gradient-to-b from-white/0 via-indigo-500/5 to-purple-500/10'}`}></div>
      <div className={`relative backdrop-blur-xl ${isDarkMode ? 'bg-black/40' : 'bg-white/40'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <motion.div {...getMotionProps(0)} className="flex items-center gap-3 mb-10">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Ticket className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -inset-1 rounded-xl bg-indigo-500/0 group-hover:bg-indigo-500/10 transition" />
            </div>
            <div>
              <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>TicketHub</p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Book. Enjoy. Repeat.</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            <motion.div {...getMotionProps(0.05)} className="col-span-1 lg:col-span-2 space-y-5">
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} max-w-md`}>
                Your premier destination for concerts, sports, theater, and more. Seamless booking with a delightful experience.
              </p>
              <div className="flex items-center gap-3">
                {[
                  { Icon: Facebook, href: '#', label: 'Facebook' },
                  { Icon: Twitter, href: '#', label: 'Twitter' },
                  { Icon: Instagram, href: '#', label: 'Instagram' },
                  { Icon: Youtube, href: '#', label: 'YouTube' },
                  { Icon: Linkedin, href: '#', label: 'LinkedIn' }
                ].map(({ Icon, href, label }, idx) => (
                  <motion.a
                    key={label}
                    href={href}
                    aria-label={label}
                    whileHover={{ y: -2, scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className={`relative inline-flex items-center justify-center h-10 w-10 rounded-full ${isDarkMode ? 'bg-white/5 text-gray-300 hover:text-white' : 'bg-black/5 text-gray-700 hover:text-gray-900'} transition-colors`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className={`absolute inset-0 rounded-full blur-md ${isDarkMode ? 'bg-indigo-500/0 hover:bg-indigo-500/30' : 'bg-indigo-400/0 hover:bg-indigo-400/30'} transition-opacity`} />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            <motion.div {...getMotionProps(0.1)}>
              <h3 className={`text-sm font-semibold tracking-wide mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Quick Links</h3>
              <ul className="space-y-2">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/event', label: 'Events' },
                  { to: '/about', label: 'About Us' },
                  { to: '/contact', label: 'Contact' }
                ].map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className={`group inline-flex items-center gap-2 text-sm ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                      <span className="h-px w-0 bg-indigo-500 group-hover:w-4 transition-all" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div {...getMotionProps(0.15)}>
              <h3 className={`text-sm font-semibold tracking-wide mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Categories</h3>
              <ul className="space-y-2">
                {[
                  { to: '/movies', label: 'Movies' },
                  { to: '/concerts', label: 'Concerts' },
                  { to: '/sports', label: 'Sports' }
                ].map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className={`group inline-flex items-center gap-2 text-sm ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                      <span className="h-px w-0 bg-purple-500 group-hover:w-4 transition-all" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div {...getMotionProps(0.2)}>
              <h3 className={`text-sm font-semibold tracking-wide mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Mail className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm`}>support@tickethub.com</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm`}>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm`}>123 Event St, City, ST 12345</span>
                </li>
              </ul>
            </motion.div>

            <motion.div {...getMotionProps(0.25)}>
              <h3 className={`text-sm font-semibold tracking-wide mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Newsletter</h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm mb-3`}>Get the latest events and offers straight to your inbox.</p>
              <form className="group relative">
                <div className={`flex items-center rounded-xl ring-1 ${isDarkMode ? 'ring-white/10 bg-white/5' : 'ring-black/10 bg-black/5'} focus-within:ring-2 focus-within:ring-indigo-500 transition-all`}> 
                  <input
                    type="email"
                    placeholder="Your email"
                    className={`flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:${isDarkMode ? 'text-gray-400' : 'text-gray-500'} ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className={`m-1 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium shadow-sm transition-colors ${isDarkMode ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
                    aria-label="Subscribe"
                  >
                    <Send className="h-4 w-4" /> Subscribe
                  </motion.button>
                </div>
                <motion.div aria-hidden className={`absolute -inset-1 rounded-2xl blur-2xl ${isDarkMode ? 'bg-indigo-500/0 group-focus-within:bg-indigo-500/20' : 'bg-indigo-400/0 group-focus-within:bg-indigo-400/20'} transition`} />
              </form>
            </motion.div>
          </div>

          <motion.div {...getMotionProps(0.3)} className={`mt-10 pt-8 border-t ${isDarkMode ? 'border-white/10' : 'border-black/10'}`}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>© {new Date().getFullYear()} TicketHub. All rights reserved.</p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <Link to="/privacy" className={`text-sm ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Privacy Policy</Link>
                <Link to="/terms" className={`text-sm ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Terms of Service</Link>
                <Link to="/support" className={`text-sm ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Support</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;