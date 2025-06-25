import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';

interface Profile {
  id: number;
  name: string;
  age: number;
  shortDescription: string;
  profilePhoto: string;
  location: string;
  isPremium?: boolean;
}

interface ProfileCardProps {
  profile: Profile;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  return (
    <Link 
      to={`/profile/${profile.id}`}
      className="group block bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl overflow-hidden backdrop-blur-sm border border-gray-700/50 hover:border-gold-500/50 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-gold-500/10"
    >
      <div className="relative overflow-hidden">
        <img 
          src={profile.profilePhoto} 
          alt={profile.name}
          className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute top-4 right-4">
          {profile.isPremium ? (
            <div className="flex items-center space-x-1 bg-gradient-to-r from-gold-500 to-rose-500 rounded-full px-3 py-1">
              <Star className="w-4 h-4 text-black fill-current" />
              <span className="text-black text-sm font-bold">Premium</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
              <Star className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-sm font-medium">Standard</span>
            </div>
          )}
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">{profile.name}</h3>
              <p className="text-gold-400 font-medium">Age {profile.age}</p>
            </div>
            <div className="flex items-center text-gray-300">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{profile.location}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <p className="text-gray-300 leading-relaxed mb-4">
          {profile.shortDescription}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-gold-400 font-medium group-hover:text-gold-300 transition-colors">
            View Profile →
          </span>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${
            profile.isPremium 
              ? 'bg-gradient-to-r from-gold-500 to-rose-500' 
              : 'bg-gray-600'
          }`}>
            <Star className={`w-4 h-4 fill-current ${
              profile.isPremium ? 'text-black' : 'text-gray-300'
            }`} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProfileCard;