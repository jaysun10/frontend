import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, Send, Clock, Shield, Heart } from 'lucide-react';
import { API_ENDPOINTS, apiRequest, APP_CONFIG } from '../config/api';

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

const Footer = () => {
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings | null>(null);

  useEffect(() => {
    const fetchWebsiteSettings = async () => {
      try {
        const data = await apiRequest(API_ENDPOINTS.WEBSITE_SETTINGS);
        setWebsiteSettings(data);
      } catch (error) {
        console.error('Error fetching website settings:', error);
        // Fallback settings from environment variables
        setWebsiteSettings({
          contactInfo: {
            whatsapp: APP_CONFIG.CONTACT.WHATSAPP,
            telegram: APP_CONFIG.CONTACT.TELEGRAM,
            phone: APP_CONFIG.CONTACT.PHONE
          },
          businessInfo: {
            name: APP_CONFIG.NAME,
            tagline: APP_CONFIG.TAGLINE,
            description: "We provide sophisticated companionship services with the highest standards of professionalism, discretion, and elegance."
          }
        });
      }
    };

    fetchWebsiteSettings();
  }, []);

  const handleWhatsApp = () => {
    if (websiteSettings?.contactInfo.whatsapp) {
      window.open(`https://wa.me/${websiteSettings.contactInfo.whatsapp.replace(/[^0-9]/g, '')}`, '_blank');
    }
  };

  const handleTelegram = () => {
    if (websiteSettings?.contactInfo.telegram) {
      const username = websiteSettings.contactInfo.telegram.startsWith('@') 
        ? websiteSettings.contactInfo.telegram.slice(1) 
        : websiteSettings.contactInfo.telegram;
      window.open(`https://t.me/${username}`, '_blank');
    }
  };

  const handlePhone = () => {
    if (websiteSettings?.contactInfo.phone) {
      window.location.href = `tel:${websiteSettings.contactInfo.phone}`;
    }
  };

  if (!websiteSettings) {
    return null; // or a loading spinner
  }

  return (
    <footer className="bg-black/80 backdrop-blur-md border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Us */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-gold-400 to-rose-400 bg-clip-text text-transparent">
              About {websiteSettings.businessInfo.name}
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {websiteSettings.businessInfo.description}
            </p>
            <div className="flex items-center space-x-2 text-gold-400">
              <Shield className="w-5 h-5" />
              <span className="text-sm">100% Confidential & Secure</span>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-gold-400 to-rose-400 bg-clip-text text-transparent">
              Contact Us
            </h3>
            <div className="space-y-3">
              {websiteSettings.contactInfo.whatsapp && (
                <button
                  onClick={handleWhatsApp}
                  className="flex items-center space-x-3 w-full p-3 bg-green-600/20 hover:bg-green-600/30 rounded-lg transition-colors border border-green-500/30 hover:border-green-500/50"
                >
                  <MessageCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white">WhatsApp</span>
                </button>
              )}
              
              {websiteSettings.contactInfo.telegram && (
                <button
                  onClick={handleTelegram}
                  className="flex items-center space-x-3 w-full p-3 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg transition-colors border border-blue-500/30 hover:border-blue-500/50"
                >
                  <Send className="w-5 h-5 text-blue-400" />
                  <span className="text-white">Telegram</span>
                </button>
              )}
              
              {websiteSettings.contactInfo.phone && (
                <button
                  onClick={handlePhone}
                  className="flex items-center space-x-3 w-full p-3 bg-gold-600/20 hover:bg-gold-600/30 rounded-lg transition-colors border border-gold-500/30 hover:border-gold-500/50"
                >
                  <Phone className="w-5 h-5 text-gold-400" />
                  <span className="text-white">Call Now</span>
                </button>
              )}
            </div>
          </div>

          {/* Service Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-gold-400 to-rose-400 bg-clip-text text-transparent">
              Service Hours
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <Clock className="w-5 h-5 text-gold-400" />
                <span>Available 24/7</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Heart className="w-5 h-5 text-rose-400" />
                <span>Premium Quality Service</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-gold-500/10 to-rose-500/10 rounded-lg border border-gold-500/20">
              <p className="text-sm text-gray-300 text-center">
                <strong className="text-gold-400">18+ Only</strong><br />
                All services are for adults only. We maintain strict confidentiality and professionalism.
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 {websiteSettings.businessInfo.name}. All rights reserved. | 
            <span className="text-gold-400 ml-1">{websiteSettings.businessInfo.tagline}</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;