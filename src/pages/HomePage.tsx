import React, { useState, useEffect, useRef } from 'react';
import ProfileCard from '../components/ProfileCard';
import Header from '../components/Header';
import { Star, Sparkles, MessageCircle, Send, Phone } from 'lucide-react';
import { API_ENDPOINTS, apiRequest } from '../config/api';

interface Profile {
  id: number;
  name: string;
  age: number;
  shortDescription: string;
  profilePhoto: string;
  location: string;
  isPremium?: boolean;
}

interface SlideContent {
  heading: string;
  description: string;
  iconImage: string;
}

interface WebsiteSettings {
  contactInfo: {
    whatsapp: string;
    telegram: string;
    phone: string;
  };
  businessInfo: {
    name: string;
    tagline: string;
    description: string;
  };
}

const HomePage = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const contactSectionRef = useRef<HTMLDivElement>(null);

  const slideContent: SlideContent[] = [
    {
      heading: "Explore Every Position You've Dreamed Of…",
      description: "From soft sensuality to wild domination — your fantasy, your way.",
      iconImage: "/noun-sex-position-728755.png"
    },
    {
      heading: "Bend, Ride, Grip — Feel It All.",
      description: "Whether it's doggystyle, missionary, or something deeper... we make it real.",
      iconImage: "/noun-sex-position-728753.png"
    },
    {
      heading: "She's Not Just a Companion — She's Your Dirty Secret.",
      description: "Premium girls ready to ride your lust and push your limits.",
      iconImage: "/noun-sex-position-728749.png"
    },
    {
      heading: "Your Fantasy Position, Her Passionate Performance.",
      description: "No limits. No rules. Just raw satisfaction.",
      iconImage: "/noun-sex-position-728760.png"
    },
    {
      heading: "Why Imagine, When You Can Feel It Tonight?",
      description: "Tap, choose, and let her take you to the edge.",
      iconImage: "/sex_9981788.png"
    },
    {
      heading: "Legs Up, Back Arched, Eyes Locked.",
      description: "She knows exactly how to move — and how you love it.",
      iconImage: "/noun-sex-position-728755.png"
    },
    {
      heading: "Missionary, Cowgirl, Reverse — Your Night, Your Rules.",
      description: "Every angle, every moan, just how you want it.",
      iconImage: "/noun-sex-position-728753.png"
    },
    {
      heading: "Grip Her Hips. Feel Her Pulse. Lose Control.",
      description: "We don't offer company — we offer pure, naked pleasure.",
      iconImage: "/noun-sex-position-728749.png"
    },
    {
      heading: "Slide In. Slow or Hard. She's Ready.",
      description: "No holding back. Just lust on demand.",
      iconImage: "/noun-sex-position-728760.png"
    },
    {
      heading: "A New Position. A New Girl. Every Night.",
      description: "Your fantasy playground starts here. Welcome to Midnight Queens.",
      iconImage: "/sex_9981788.png"
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profiles
        const profilesData = await apiRequest(API_ENDPOINTS.PROFILES);
        setProfiles(profilesData);
        setFilteredProfiles(profilesData);

        // Fetch website settings
        const settingsData = await apiRequest(API_ENDPOINTS.WEBSITE_SETTINGS);
        setWebsiteSettings(settingsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback data if server is not available
        const fallbackProfiles = [
          {
            id: 1,
            name: "Sophia",
            age: 24,
            shortDescription: "Elegant and sophisticated companion with a warm personality",
            profilePhoto: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400",
            location: "Manhattan",
            isPremium: true
          },
          {
            id: 2,
            name: "Isabella",
            age: 26,
            shortDescription: "Vivacious and adventurous with an infectious energy",
            profilePhoto: "https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg?auto=compress&cs=tinysrgb&w=400",
            location: "Brooklyn",
            isPremium: false
          }
        ];
        setProfiles(fallbackProfiles);
        setFilteredProfiles(fallbackProfiles);

        // Fallback website settings
        setWebsiteSettings({
          contactInfo: {
            whatsapp: "+1234567890",
            telegram: "@midnightqueens",
            phone: "+1234567890"
          },
          businessInfo: {
            name: "Midnight Queens",
            tagline: "Premium Adult Services",
            description: "We provide sophisticated companionship services with the highest standards of professionalism, discretion, and elegance."
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Slideshow effect - changed to 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideContent.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [slideContent.length]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredProfiles(profiles);
      return;
    }

    const filtered = profiles.filter(profile => {
      const searchTerm = query.toLowerCase();
      return (
        profile.name.toLowerCase().includes(searchTerm) ||
        profile.location.toLowerCase().includes(searchTerm) ||
        profile.age.toString().includes(searchTerm)
      );
    });
    
    setFilteredProfiles(filtered);
  };

  const handleContact = (method: string) => {
    if (!websiteSettings?.contactInfo) return;
    
    switch (method) {
      case 'whatsapp':
        if (websiteSettings.contactInfo.whatsapp) {
          window.open(`https://wa.me/${websiteSettings.contactInfo.whatsapp.replace(/[^0-9]/g, '')}`, '_blank');
        }
        break;
      case 'telegram':
        if (websiteSettings.contactInfo.telegram) {
          const username = websiteSettings.contactInfo.telegram.startsWith('@') 
            ? websiteSettings.contactInfo.telegram.slice(1) 
            : websiteSettings.contactInfo.telegram;
          window.open(`https://t.me/${username}`, '_blank');
        }
        break;
      case 'phone':
        if (websiteSettings.contactInfo.phone) {
          window.location.href = `tel:${websiteSettings.contactInfo.phone}`;
        }
        break;
    }
  };

  const scrollToContact = () => {
    contactSectionRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <Header onSearch={handleSearch} onContactClick={scrollToContact} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-300">Loading our exclusive companions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Header onSearch={handleSearch} onContactClick={scrollToContact} />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Hero Slideshow Section with Position Icons */}
          <div className="relative text-center space-y-6 py-16 overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-red-900/30">
            
            {/* Sparkles decoration */}
            <div className="flex items-center justify-center space-x-2 mb-6 relative z-10">
              <Sparkles className="w-8 h-8 text-gold-400 animate-pulse" />
              <Sparkles className="w-8 h-8 text-rose-400 animate-pulse" />
            </div>

            {/* Slideshow Content with Icons */}
            <div className="relative z-10 min-h-[400px] flex items-center justify-center">
              <div className="max-w-6xl mx-auto">
                {slideContent.map((slide, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                      index === currentSlide 
                        ? 'opacity-100 transform translate-y-0' 
                        : 'opacity-0 transform translate-y-4'
                    }`}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full">
                      {/* Text Content */}
                      <div className="space-y-6">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight drop-shadow-2xl">
                          <span className="bg-gradient-to-r from-gold-400 via-rose-400 to-purple-400 bg-clip-text text-transparent italic font-serif">
                            {slide.heading}
                          </span>
                        </h1>
                        
                        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 leading-relaxed italic font-serif drop-shadow-lg">
                          {slide.description}
                        </p>
                      </div>

                      {/* Position Icon */}
                      <div className="flex items-center justify-center">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-gold-400/20 to-rose-400/20 rounded-full blur-3xl scale-150"></div>
                          <div className="relative bg-gradient-to-br from-gold-500/10 to-rose-500/10 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-gold-500/20">
                            <img
                              src={slide.iconImage}
                              alt="Position illustration"
                              className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 object-contain filter brightness-0 invert opacity-80"
                              style={{
                                filter: 'brightness(0) saturate(100%) invert(85%) sepia(58%) saturate(2476%) hue-rotate(315deg) brightness(106%) contrast(97%)'
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slide indicators */}
            <div className="flex items-center justify-center space-x-2 mt-8 relative z-10">
              {slideContent.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-gradient-to-r from-gold-400 to-rose-400 scale-125' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
            
            {/* Premium features - Made Responsive */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 text-gold-400 mt-8 relative z-10">
              <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2">
                <Star className="w-4 sm:w-5 h-4 sm:h-5 fill-current" />
                <span className="font-medium italic text-sm sm:text-base">Premium Quality</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-gold-400 rounded-full"></div>
              <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2">
                <Star className="w-4 sm:w-5 h-4 sm:h-5 fill-current" />
                <span className="font-medium italic text-sm sm:text-base">Absolute Discretion</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-gold-400 rounded-full"></div>
              <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2">
                <Star className="w-4 sm:w-5 h-4 sm:h-5 fill-current" />
                <span className="font-medium italic text-sm sm:text-base">Available 24/7</span>
              </div>
            </div>
          </div>

          {/* Search Results Info */}
          {searchQuery && (
            <div className="text-center py-4">
              <p className="text-gray-300">
                {filteredProfiles.length > 0 
                  ? `Found ${filteredProfiles.length} companion${filteredProfiles.length !== 1 ? 's' : ''} matching "${searchQuery}"`
                  : `No companions found matching "${searchQuery}"`
                }
              </p>
            </div>
          )}

          {/* Profiles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProfiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>

          {/* No Results Message */}
          {searchQuery && filteredProfiles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-4">No companions match your search criteria.</p>
              <p className="text-gray-500">Try searching by name, age, or location.</p>
            </div>
          )}

          {/* Call to Action - Contact Section */}
          <div 
            ref={contactSectionRef}
            className="text-center py-12 bg-gradient-to-r from-gold-500/10 to-rose-500/10 rounded-2xl border border-gold-500/20 mt-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4 italic font-serif">
              Ready for an Exceptional Experience?
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto italic">
              Contact us today to arrange a meeting with one of our sophisticated companions. 
              We ensure complete discretion and professionalism in all our services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {websiteSettings?.contactInfo.whatsapp && (
                <button 
                  onClick={() => handleContact('whatsapp')}
                  className="flex items-center justify-center space-x-2 px-8 py-3 bg-green-600/20 hover:bg-green-600/30 text-green-400 font-bold rounded-full border border-green-500/30 hover:border-green-500/50 transition-all italic"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Contact via WhatsApp</span>
                </button>
              )}
              {websiteSettings?.contactInfo.telegram && (
                <button 
                  onClick={() => handleContact('telegram')}
                  className="flex items-center justify-center space-x-2 px-8 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 font-bold rounded-full border border-blue-500/30 hover:border-blue-500/50 transition-all italic"
                >
                  <Send className="w-5 h-5" />
                  <span>Contact via Telegram</span>
                </button>
              )}
              {websiteSettings?.contactInfo.phone && (
                <button 
                  onClick={() => handleContact('phone')}
                  className="flex items-center justify-center space-x-2 px-8 py-3 bg-gradient-to-r from-gold-500 to-rose-500 text-black font-bold rounded-full hover:shadow-lg hover:shadow-gold-500/25 transition-all italic"
                >
                  <Phone className="w-5 h-5" />
                  <span>Call Now</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;