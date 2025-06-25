import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Clock, Phone, MessageCircle, Send, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import { API_ENDPOINTS, apiRequest } from '../config/api';

interface Profile {
  id: number;
  name: string;
  age: number;
  shortDescription: string;
  fullDescription: string;
  profilePhoto: string;
  additionalPhotos: string[];
  services: string[];
  location: string;
  availability: string;
  isPremium?: boolean;
  contactInfo?: {
    whatsapp: string;
    telegram: string;
    phone: string;
  };
}

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiRequest(`${API_ENDPOINTS.PROFILES}/${id}`);
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Fallback data if server is not available
        const fallbackProfiles = [
          {
            id: 1,
            name: "Sophia",
            age: 24,
            shortDescription: "Elegant and sophisticated companion with a warm personality",
            fullDescription: "Sophia is an intelligent and charming companion who brings elegance to every encounter. With her warm smile and engaging conversation, she creates memorable experiences. She enjoys fine dining, cultural events, and meaningful connections. Available for dinner dates, social events, and sophisticated companionship.",
            profilePhoto: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400",
            additionalPhotos: [
              "https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=600",
              "https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=600"
            ],
            services: ["Dinner Dates", "Social Events", "Travel Companion"],
            location: "Manhattan",
            availability: "By Appointment",
            isPremium: true,
            contactInfo: {
              whatsapp: "+1234567890",
              telegram: "@sophia_companion",
              phone: "+1234567890"
            }
          },
          {
            id: 2,
            name: "Isabella",
            age: 26,
            shortDescription: "Vivacious and adventurous with an infectious energy",
            fullDescription: "Isabella brings excitement and joy to every moment. Her adventurous spirit and vibrant personality make her the perfect companion for those seeking memorable experiences. She loves exploring the city, trying new restaurants, and engaging in stimulating conversations. Her warm and friendly nature puts everyone at ease.",
            profilePhoto: "https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg?auto=compress&cs=tinysrgb&w=400",
            additionalPhotos: [
              "https://images.pexels.com/photos/1484794/pexels-photo-1484794.jpeg?auto=compress&cs=tinysrgb&w=600",
              "https://images.pexels.com/photos/1462980/pexels-photo-1462980.jpeg?auto=compress&cs=tinysrgb&w=600"
            ],
            services: ["City Tours", "Entertainment Events", "Casual Dining"],
            location: "Brooklyn",
            availability: "Flexible Schedule",
            isPremium: false,
            contactInfo: {
              whatsapp: "+1234567891",
              telegram: "@isabella_fun",
              phone: "+1234567891"
            }
          }
        ];
        
        const foundProfile = fallbackProfiles.find(p => p.id === parseInt(id || '0'));
        if (foundProfile) {
          setProfile(foundProfile);
        } else {
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id, navigate]);

  const handleContact = (method: string) => {
    if (!profile?.contactInfo) return;
    
    switch (method) {
      case 'whatsapp':
        if (profile.contactInfo.whatsapp) {
          window.open(`https://wa.me/${profile.contactInfo.whatsapp.replace(/[^0-9]/g, '')}?text=Hello, I'm interested in booking with ${profile.name}`, '_blank');
        }
        break;
      case 'telegram':
        if (profile.contactInfo.telegram) {
          const username = profile.contactInfo.telegram.startsWith('@') 
            ? profile.contactInfo.telegram.slice(1) 
            : profile.contactInfo.telegram;
          window.open(`https://t.me/${username}`, '_blank');
        }
        break;
      case 'phone':
        if (profile.contactInfo.phone) {
          window.location.href = `tel:${profile.contactInfo.phone}`;
        }
        break;
    }
  };

  const nextPhoto = () => {
    if (profile) {
      const allPhotos = [profile.profilePhoto, ...profile.additionalPhotos];
      setSelectedPhoto((prev) => (prev + 1) % allPhotos.length);
    }
  };

  const prevPhoto = () => {
    if (profile) {
      const allPhotos = [profile.profilePhoto, ...profile.additionalPhotos];
      setSelectedPhoto((prev) => (prev - 1 + allPhotos.length) % allPhotos.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-300">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-white mb-4">Profile Not Found</h2>
            <Link to="/" className="text-gold-400 hover:text-gold-300">
              Return to Gallery
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const allPhotos = [profile.profilePhoto, ...profile.additionalPhotos];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 text-gold-400 hover:text-gold-300 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Gallery</span>
          </Link>

          {/* Instagram-style Layout */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl overflow-hidden backdrop-blur-sm border border-gray-700/50">
            
            {/* Header with Profile Info */}
            <div className="p-6 border-b border-gray-700/50">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-gradient-to-r from-gold-400 to-rose-400 p-1">
                  <img 
                    src={profile.profilePhoto} 
                    alt={profile.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
                    {profile.isPremium ? (
                      <div className="flex items-center space-x-1 bg-gradient-to-r from-gold-500 to-rose-500 rounded-full px-3 py-1">
                        <Star className="w-4 h-4 text-black fill-current" />
                        <span className="text-black text-sm font-bold">Premium</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 bg-gray-600/50 rounded-full px-3 py-1">
                        <Star className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400 text-sm font-medium">Standard</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-gray-300 text-sm">
                    <span className="flex items-center space-x-1">
                      <Heart className="w-4 h-4 text-rose-400" />
                      <span>Age {profile.age}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{profile.availability}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Photo Gallery with Navigation */}
            <div className="relative">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={allPhotos[selectedPhoto]} 
                  alt={`${profile.name} ${selectedPhoto + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Photo Navigation */}
              {allPhotos.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all"
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                  
                  {/* Photo Indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {allPhotos.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedPhoto(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          selectedPhoto === index ? 'bg-gold-400' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Content Section */}
            <div className="p-6 space-y-6">
              {/* Bio/Description */}
              <div>
                <h3 className="text-lg font-bold text-gold-400 mb-3">About {profile.name}</h3>
                <p className="text-gray-300 leading-relaxed">
                  {profile.fullDescription}
                </p>
              </div>

              {/* Services */}
              <div>
                <h3 className="text-lg font-bold text-gold-400 mb-3">Services</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.services.map((service, index) => (
                    <span 
                      key={index}
                      className={`border rounded-full px-4 py-2 text-sm text-white ${
                        profile.isPremium 
                          ? 'bg-gradient-to-r from-gold-500/20 to-rose-500/20 border-gold-500/30'
                          : 'bg-gray-600/20 border-gray-500/30'
                      }`}
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Section */}
              <div className="border-t border-gray-700/50 pt-6">
                <h3 className="text-lg font-bold text-gold-400 mb-4">Contact {profile.name}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {profile.contactInfo?.whatsapp && (
                    <button
                      onClick={() => handleContact('whatsapp')}
                      className="flex items-center justify-center space-x-2 p-3 bg-green-600/20 hover:bg-green-600/30 rounded-xl transition-all border border-green-500/30 hover:border-green-500/50"
                    >
                      <MessageCircle className="w-5 h-5 text-green-400" />
                      <span className="text-white font-medium">WhatsApp</span>
                    </button>
                  )}
                  
                  {profile.contactInfo?.telegram && (
                    <button
                      onClick={() => handleContact('telegram')}
                      className="flex items-center justify-center space-x-2 p-3 bg-blue-600/20 hover:bg-blue-600/30 rounded-xl transition-all border border-blue-500/30 hover:border-blue-500/50"
                    >
                      <Send className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-medium">Telegram</span>
                    </button>
                  )}
                  
                  {profile.contactInfo?.phone && (
                    <button
                      onClick={() => handleContact('phone')}
                      className="flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-gold-600/20 to-rose-600/20 hover:from-gold-600/30 hover:to-rose-600/30 rounded-xl transition-all border border-gold-500/30 hover:border-gold-500/50"
                    >
                      <Phone className="w-5 h-5 text-gold-400" />
                      <span className="text-white font-medium">Call Now</span>
                    </button>
                  )}
                </div>
                
                {/* Fallback contact if no specific contact info */}
                {!profile.contactInfo && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => window.open('https://wa.me/1234567890', '_blank')}
                      className="flex items-center justify-center space-x-2 p-3 bg-green-600/20 hover:bg-green-600/30 rounded-xl transition-all border border-green-500/30 hover:border-green-500/50"
                    >
                      <MessageCircle className="w-5 h-5 text-green-400" />
                      <span className="text-white font-medium">WhatsApp</span>
                    </button>
                    
                    <button
                      onClick={() => window.open('https://t.me/thepleasurevault', '_blank')}
                      className="flex items-center justify-center space-x-2 p-3 bg-blue-600/20 hover:bg-blue-600/30 rounded-xl transition-all border border-blue-500/30 hover:border-blue-500/50"
                    >
                      <Send className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-medium">Telegram</span>
                    </button>
                    
                    <button
                      onClick={() => window.location.href = 'tel:+1234567890'}
                      className="flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-gold-600/20 to-rose-600/20 hover:from-gold-600/30 hover:to-rose-600/30 rounded-xl transition-all border border-gold-500/30 hover:border-gold-500/50"
                    >
                      <Phone className="w-5 h-5 text-gold-400" />
                      <span className="text-white font-medium">Call Now</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;