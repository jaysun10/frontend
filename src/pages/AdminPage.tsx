import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Upload, Home, Star, Phone, MessageCircle, Send, Settings, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
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
  isPremium: boolean;
  contactInfo?: {
    whatsapp: string;
    telegram: string;
    phone: string;
  };
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

const AdminPage = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showWebsiteSettings, setShowWebsiteSettings] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState<'profiles' | 'settings'>('profiles');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    shortDescription: '',
    fullDescription: '',
    profilePhoto: '',
    additionalPhotos: ['', ''],
    services: [''],
    location: '',
    availability: '',
    isPremium: false,
    contactInfo: {
      whatsapp: '',
      telegram: '',
      phone: ''
    }
  });

  useEffect(() => {
    fetchProfiles();
    fetchWebsiteSettings();
  }, []);

  const fetchProfiles = async () => {
    try {
      const data = await apiRequest(API_ENDPOINTS.PROFILES);
      setProfiles(data);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWebsiteSettings = async () => {
    try {
      const data = await apiRequest(API_ENDPOINTS.WEBSITE_SETTINGS);
      setWebsiteSettings(data);
    } catch (error) {
      console.error('Error fetching website settings:', error);
      // Fallback settings
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
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContactChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value
      }
    }));
  };

  const handleWebsiteSettingsChange = (section: string, field: string, value: string) => {
    if (!websiteSettings) return;
    
    setWebsiteSettings(prev => ({
      ...prev!,
      [section]: {
        ...prev![section as keyof WebsiteSettings],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].map((item: string, i: number) => 
        i === index ? value : item
      )
    }));
  };

  const addArrayItem = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field as keyof typeof prev], '']
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].filter((_: string, i: number) => i !== index)
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      age: '',
      shortDescription: '',
      fullDescription: '',
      profilePhoto: '',
      additionalPhotos: ['', ''],
      services: [''],
      location: '',
      availability: '',
      isPremium: false,
      contactInfo: {
        whatsapp: '',
        telegram: '',
        phone: ''
      }
    });
    setShowAddForm(false);
    setEditingProfile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const profileData = {
      ...formData,
      age: parseInt(formData.age),
      additionalPhotos: formData.additionalPhotos.filter(photo => photo.trim() !== ''),
      services: formData.services.filter(service => service.trim() !== '')
    };

    try {
      const url = editingProfile 
        ? `${API_ENDPOINTS.PROFILES}/${editingProfile.id}`
        : API_ENDPOINTS.PROFILES;
      
      const method = editingProfile ? 'PUT' : 'POST';
      
      await apiRequest(url, {
        method,
        body: JSON.stringify(profileData),
      });

      fetchProfiles();
      resetForm();
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleWebsiteSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await apiRequest(API_ENDPOINTS.WEBSITE_SETTINGS, {
        method: 'PUT',
        body: JSON.stringify(websiteSettings),
      });

      setShowWebsiteSettings(false);
      alert('Website settings updated successfully!');
    } catch (error) {
      console.error('Error updating website settings:', error);
    }
  };

  const handleEdit = (profile: Profile) => {
    setEditingProfile(profile);
    setFormData({
      name: profile.name,
      age: profile.age.toString(),
      shortDescription: profile.shortDescription,
      fullDescription: profile.fullDescription,
      profilePhoto: profile.profilePhoto,
      additionalPhotos: profile.additionalPhotos.length > 0 ? profile.additionalPhotos : ['', ''],
      services: profile.services.length > 0 ? profile.services : [''],
      location: profile.location,
      availability: profile.availability,
      isPremium: profile.isPremium || false,
      contactInfo: {
        whatsapp: profile.contactInfo?.whatsapp || '',
        telegram: profile.contactInfo?.telegram || '',
        phone: profile.contactInfo?.phone || ''
      }
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this profile?')) {
      try {
        await apiRequest(`${API_ENDPOINTS.PROFILES}/${id}`, {
          method: 'DELETE',
        });
        
        fetchProfiles();
      } catch (error) {
        console.error('Error deleting profile:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-300">Loading admin panel...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl border border-gray-600/50 hover:border-gold-500/50 transition-all text-gray-300 hover:text-gold-400"
              >
                <Home className="w-5 h-5" />
                <span>Go to Home</span>
              </Link>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gold-400 to-rose-400 bg-clip-text text-transparent">
                Midnight Queens - Admin Panel
              </h1>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-4 border-b border-gray-700/50">
            <button
              onClick={() => setActiveTab('profiles')}
              className={`px-6 py-3 font-medium transition-all ${
                activeTab === 'profiles'
                  ? 'text-gold-400 border-b-2 border-gold-400'
                  : 'text-gray-400 hover:text-gold-400'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span>Manage Profiles</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-3 font-medium transition-all ${
                activeTab === 'settings'
                  ? 'text-gold-400 border-b-2 border-gold-400'
                  : 'text-gray-400 hover:text-gold-400'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Website Settings</span>
              </div>
            </button>
          </div>

          {/* Profiles Tab */}
          {activeTab === 'profiles' && (
            <>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-gold-500 to-rose-500 text-black font-bold rounded-xl hover:shadow-lg transition-all"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add New Profile</span>
                </button>
              </div>

              {/* Profiles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles.map((profile) => (
                  <div key={profile.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl overflow-hidden border border-gray-700/50">
                    <div className="relative">
                      <img 
                        src={profile.profilePhoto} 
                        alt={profile.name}
                        className="w-full h-48 object-cover"
                      />
                      {profile.isPremium && (
                        <div className="absolute top-3 right-3">
                          <div className="flex items-center space-x-1 bg-gradient-to-r from-gold-500 to-rose-500 rounded-full px-3 py-1">
                            <Star className="w-4 h-4 text-black fill-current" />
                            <span className="text-black text-sm font-bold">Premium</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-white">{profile.name}</h3>
                        <span className="text-gold-400">Age {profile.age}</span>
                      </div>
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                        {profile.shortDescription}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-400 text-sm">{profile.location}</span>
                        {profile.isPremium ? (
                          <span className="text-gold-400 text-sm font-medium">Premium</span>
                        ) : (
                          <span className="text-gray-500 text-sm">Standard</span>
                        )}
                      </div>
                      
                      {/* Contact Info Display */}
                      {profile.contactInfo && (
                        <div className="flex items-center space-x-2 mb-4 text-xs">
                          {profile.contactInfo.whatsapp && (
                            <div className="flex items-center space-x-1 bg-green-600/20 rounded px-2 py-1">
                              <MessageCircle className="w-3 h-3 text-green-400" />
                              <span className="text-green-400">WA</span>
                            </div>
                          )}
                          {profile.contactInfo.telegram && (
                            <div className="flex items-center space-x-1 bg-blue-600/20 rounded px-2 py-1">
                              <Send className="w-3 h-3 text-blue-400" />
                              <span className="text-blue-400">TG</span>
                            </div>
                          )}
                          {profile.contactInfo.phone && (
                            <div className="flex items-center space-x-1 bg-gold-600/20 rounded px-2 py-1">
                              <Phone className="w-3 h-3 text-gold-400" />
                              <span className="text-gold-400">Phone</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(profile)}
                          className="flex items-center space-x-1 px-3 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-all"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(profile.id)}
                          className="flex items-center space-x-1 px-3 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Website Settings Tab */}
          {activeTab === 'settings' && websiteSettings && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-700/50">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-8 h-8 text-gold-400" />
                    <h2 className="text-2xl font-bold text-gold-400">Website Settings</h2>
                  </div>
                </div>

                <form onSubmit={handleWebsiteSettingsSubmit} className="space-y-8">
                  {/* Business Information */}
                  <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
                    <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center space-x-2">
                      <Star className="w-5 h-5" />
                      <span>Business Information</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-purple-400 font-medium mb-2">Business Name</label>
                        <input
                          type="text"
                          value={websiteSettings.businessInfo.name}
                          onChange={(e) => handleWebsiteSettingsChange('businessInfo', 'name', e.target.value)}
                          className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-purple-400 font-medium mb-2">Tagline</label>
                        <input
                          type="text"
                          value={websiteSettings.businessInfo.tagline}
                          onChange={(e) => handleWebsiteSettingsChange('businessInfo', 'tagline', e.target.value)}
                          className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-purple-400 font-medium mb-2">Business Description</label>
                      <textarea
                        value={websiteSettings.businessInfo.description}
                        onChange={(e) => handleWebsiteSettingsChange('businessInfo', 'description', e.target.value)}
                        className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none h-24"
                      />
                    </div>
                  </div>

                  {/* Global Contact Information */}
                  <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl p-6 border border-green-500/20">
                    <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center space-x-2">
                      <Phone className="w-5 h-5" />
                      <span>Website Contact Information</span>
                    </h3>
                    <p className="text-gray-400 text-sm mb-6">
                      These contact details will appear in the footer and homepage contact sections for general inquiries.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-green-400 font-medium mb-2 flex items-center space-x-2">
                          <MessageCircle className="w-4 h-4" />
                          <span>WhatsApp Number</span>
                        </label>
                        <input
                          type="tel"
                          value={websiteSettings.contactInfo.whatsapp}
                          onChange={(e) => handleWebsiteSettingsChange('contactInfo', 'whatsapp', e.target.value)}
                          placeholder="+1234567890"
                          className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-green-400 font-medium mb-2 flex items-center space-x-2">
                          <Send className="w-4 h-4" />
                          <span>Telegram Username</span>
                        </label>
                        <input
                          type="text"
                          value={websiteSettings.contactInfo.telegram}
                          onChange={(e) => handleWebsiteSettingsChange('contactInfo', 'telegram', e.target.value)}
                          placeholder="@username"
                          className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-green-400 font-medium mb-2 flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>Phone Number</span>
                        </label>
                        <input
                          type="tel"
                          value={websiteSettings.contactInfo.phone}
                          onChange={(e) => handleWebsiteSettingsChange('contactInfo', 'phone', e.target.value)}
                          placeholder="+1234567890"
                          className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-gold-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                    >
                      <Save className="w-5 h-5" />
                      <span>Save Website Settings</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Add/Edit Profile Form */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gold-400">
                    {editingProfile ? 'Edit Profile' : 'Add New Profile'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="bg-gradient-to-r from-gray-700/20 to-gray-800/20 rounded-xl p-6 border border-gray-600/30">
                    <h3 className="text-lg font-bold text-gold-400 mb-4 flex items-center space-x-2">
                      <span>Basic Information</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gold-400 font-medium mb-2">Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-gold-500 focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gold-400 font-medium mb-2">Age</label>
                        <input
                          type="number"
                          value={formData.age}
                          onChange={(e) => handleInputChange('age', e.target.value)}
                          className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-gold-500 focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gold-400 font-medium mb-2">Location</label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-gold-500 focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gold-400 font-medium mb-2">Availability</label>
                        <input
                          type="text"
                          value={formData.availability}
                          onChange={(e) => handleInputChange('availability', e.target.value)}
                          className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-gold-500 focus:outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-xl p-6 border border-blue-500/20">
                    <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center space-x-2">
                      <Phone className="w-5 h-5" />
                      <span>Contact Information</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-blue-400 font-medium mb-2 flex items-center space-x-2">
                          <MessageCircle className="w-4 h-4" />
                          <span>WhatsApp Number</span>
                        </label>
                        <input
                          type="tel"
                          value={formData.contactInfo.whatsapp}
                          onChange={(e) => handleContactChange('whatsapp', e.target.value)}
                          placeholder="+1234567890"
                          className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-blue-400 font-medium mb-2 flex items-center space-x-2">
                          <Send className="w-4 h-4" />
                          <span>Telegram Username</span>
                        </label>
                        <input
                          type="text"
                          value={formData.contactInfo.telegram}
                          onChange={(e) => handleContactChange('telegram', e.target.value)}
                          placeholder="@username"
                          className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-blue-400 font-medium mb-2 flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>Phone Number</span>
                        </label>
                        <input
                          type="tel"
                          value={formData.contactInfo.phone}
                          onChange={(e) => handleContactChange('phone', e.target.value)}
                          placeholder="+1234567890"
                          className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-gold-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Premium Toggle */}
                  <div className="bg-gradient-to-r from-gold-500/10 to-rose-500/10 rounded-xl p-6 border border-gold-500/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Star className="w-6 h-6 text-gold-400" />
                        <div>
                          <label className="block text-gold-400 font-medium">Premium Profile</label>
                          <p className="text-gray-400 text-sm">Enable premium badge and features for this profile</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isPremium}
                          onChange={(e) => handleInputChange('isPremium', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gold-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-gold-500 peer-checked:to-rose-500"></div>
                      </label>
                    </div>
                  </div>

                  {/* Photos */}
                  <div className="bg-gradient-to-r from-gray-700/20 to-gray-800/20 rounded-xl p-6 border border-gray-600/30">
                    <h3 className="text-lg font-bold text-gold-400 mb-4">Photos</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gold-400 font-medium mb-2">Profile Photo URL</label>
                        <input
                          type="url"
                          value={formData.profilePhoto}
                          onChange={(e) => handleInputChange('profilePhoto', e.target.value)}
                          className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-gold-500 focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gold-400 font-medium mb-2">Additional Photos</label>
                        {formData.additionalPhotos.map((photo, index) => (
                          <div key={index} className="flex items-center space-x-2 mb-2">
                            <input
                              type="url"
                              value={photo}
                              onChange={(e) => handleArrayChange('additionalPhotos', index, e.target.value)}
                              className="flex-1 p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-gold-500 focus:outline-none"
                              placeholder="Photo URL"
                            />
                            <button
                              type="button"
                              onClick={() => removeArrayItem('additionalPhotos', index)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addArrayItem('additionalPhotos')}
                          className="text-gold-400 hover:text-gold-300 text-sm"
                        >
                          + Add Photo
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Descriptions */}
                  <div className="bg-gradient-to-r from-gray-700/20 to-gray-800/20 rounded-xl p-6 border border-gray-600/30">
                    <h3 className="text-lg font-bold text-gold-400 mb-4">Descriptions</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gold-400 font-medium mb-2">Short Description</label>
                        <textarea
                          value={formData.shortDescription}
                          onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                          className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-gold-500 focus:outline-none h-20"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gold-400 font-medium mb-2">Full Description</label>
                        <textarea
                          value={formData.fullDescription}
                          onChange={(e) => handleInputChange('fullDescription', e.target.value)}
                          className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-gold-500 focus:outline-none h-32"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="bg-gradient-to-r from-gray-700/20 to-gray-800/20 rounded-xl p-6 border border-gray-600/30">
                    <h3 className="text-lg font-bold text-gold-400 mb-4">Services</h3>
                    {formData.services.map((service, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <input
                          type="text"
                          value={service}
                          onChange={(e) => handleArrayChange('services', index, e.target.value)}
                          className="flex-1 p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-gold-500 focus:outline-none"
                          placeholder="Service"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem('services', index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('services')}
                      className="text-gold-400 hover:text-gold-300 text-sm"
                    >
                      + Add Service
                    </button>
                  </div>

                  <div className="flex space-x-4 pt-6">
                    <button
                      type="submit"
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-gold-500 to-rose-500 text-black font-bold rounded-xl hover:shadow-lg transition-all"
                    >
                      <Save className="w-5 h-5" />
                      <span>{editingProfile ? 'Update' : 'Save'} Profile</span>
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700/50 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;