import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EnhancedSearchProps {
  placeholder?: string;
  darkMode?: boolean;
  onClose?: () => void;
  fullWidth?: boolean;
}

const EnhancedSearch: React.FC<EnhancedSearchProps> = ({
  placeholder = 'Search for events, venues...',
  darkMode = false,
  onClose,
  fullWidth = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/event?search=${encodeURIComponent(searchTerm)}`);
      if (onClose) onClose();
    }
  };

  return (
    <div className={`${fullWidth ? 'w-full' : 'max-w-md'}`}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className={`w-full py-2 pl-10 pr-4 text-sm rounded-lg focus:outline-none focus:ring-2 
              ${darkMode 
                ? 'bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 border-gray-600' 
                : 'bg-white text-gray-900 placeholder-gray-500 focus:ring-blue-500 border-gray-300'} 
              border shadow-sm`}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <X className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </button>
          )}
        </div>
        <button type="submit" className="sr-only">Search</button>
      </form>
    </div>
  );
};

export default EnhancedSearch;