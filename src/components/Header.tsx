import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Search } from 'lucide-react';
import { APP_CONFIG } from '../config/api';

interface HeaderProps {
  onSearch?: (query: string) => void;
  onContactClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onContactClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();

  // Hide/show navbar on scroll
  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          // Scrolling down and past 100px
          setIsVisible(false);
        } else {
          // Scrolling up
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Check for hidden admin code
    if (query.toLowerCase() === 'titi') {
      navigate('/admin');
      setSearchQuery('');
      return;
    }
    
    // Pass search query to parent component
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.toLowerCase() === 'titi') {
      navigate('/admin');
      setSearchQuery('');
    }
  };

  const handleContactClick = () => {
    if (onContactClick) {
      onContactClick();
    }
  };

  return (
    <header 
      className={`bg-black/50 backdrop-blur-md border-b border-gold-500/20 sticky top-0 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <img 
                src="/erotic_2267572.png" 
                alt="Midnight Queens Logo" 
                className="w-12 h-12 group-hover:scale-110 transition-transform duration-300"
              />
              <Star className="w-4 h-4 text-rose-400 absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gold-400 to-rose-400 bg-clip-text text-transparent">
                {APP_CONFIG.NAME}
              </h1>
              <p className="text-xs text-gray-400">Premium Service • 18+ Only</p>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-300 hover:text-gold-400 transition-colors">
              Gallery
            </Link>
            
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search by name, age, location..."
                  className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-full text-white placeholder-gray-400 focus:border-gold-500/50 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all w-64"
                />
              </div>
            </form>
            
            {/* Available 24/7 Button */}
            <button
              onClick={handleContactClick}
              className="px-4 py-2 bg-gradient-to-r from-gold-500 to-rose-500 rounded-full text-black font-medium text-sm hover:shadow-lg hover:shadow-gold-500/25 transition-all cursor-pointer"
            >
              Available 24/7
            </button>
          </div>
          
          {/* Mobile Search and Contact */}
          <div className="md:hidden flex items-center space-x-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-full text-white placeholder-gray-400 focus:border-gold-500/50 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all w-32"
                />
              </div>
            </form>
            
            <button
              onClick={handleContactClick}
              className="px-3 py-2 bg-gradient-to-r from-gold-500 to-rose-500 rounded-full text-black font-medium text-xs hover:shadow-lg hover:shadow-gold-500/25 transition-all cursor-pointer"
            >
              24/7
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;