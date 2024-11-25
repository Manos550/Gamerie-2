import React, { useState } from 'react';
import { User } from '../../types';
import { useAuthStore } from '../../lib/store';
import { updateProfile } from '../../lib/profile';
import { Camera, Edit2, MapPin, Globe, Clock } from 'lucide-react';
import EditProfileModal from './EditProfileModal';
import { toast } from 'react-toastify';

interface ProfileHeaderProps {
  profile: User;
  isOwnProfile: boolean;
}

export default function ProfileHeader({ profile, isOwnProfile }: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { user: currentUser } = useAuthStore();
  const [isFollowing, setIsFollowing] = useState(
    currentUser ? profile.followers.includes(currentUser.id) : false
  );

  const handleFollow = async () => {
    if (!currentUser) {
      toast.error('Please login to follow users');
      return;
    }
    
    try {
      const updatedFollowers = isFollowing
        ? profile.followers.filter(id => id !== currentUser.id)
        : [...profile.followers, currentUser.id];
      
      await updateProfile(profile.id, { followers: updatedFollowers });
      setIsFollowing(!isFollowing);
      toast.success(isFollowing ? 'Unfollowed successfully' : 'Following successfully');
    } catch (error) {
      toast.error('Failed to update follow status');
    }
  };

  return (
    <div className="relative">
      {/* Background Image */}
      <div className="h-64 w-full relative">
        <img
          src={profile.backgroundImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80'}
          alt="Profile Background"
          className="w-full h-full object-cover rounded-lg"
        />
        {isOwnProfile && (
          <button className="absolute bottom-4 right-4 bg-gaming-card/80 p-2 rounded-full hover:bg-gaming-card transition-colors">
            <Camera className="w-5 h-5 text-gaming-neon" />
          </button>
        )}
      </div>

      {/* Profile Info */}
      <div className="bg-gaming-card -mt-20 relative rounded-lg p-6 shadow-xl border border-gaming-neon/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Profile Picture */}
          <div className="relative">
            <img
              src={profile.profileImage || 'https://via.placeholder.com/150'}
              alt={profile.username}
              className="w-32 h-32 rounded-full border-4 border-gaming-card"
            />
            {isOwnProfile && (
              <button className="absolute bottom-0 right-0 bg-gaming-card p-2 rounded-full hover:bg-gaming-neon/20 transition-colors">
                <Camera className="w-5 h-5 text-gaming-neon" />
              </button>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-display font-bold text-white">
                  {profile.username}
                </h1>
                <p className="text-gaming-neon font-medium">{profile.role}</p>
              </div>
              
              {isOwnProfile ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gaming-neon text-black rounded-md hover:bg-gaming-neon/90 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={handleFollow}
                  className={`px-6 py-2 rounded-md transition-colors ${
                    isFollowing
                      ? 'bg-gaming-card border border-gaming-neon text-gaming-neon'
                      : 'bg-gaming-neon text-black'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>

            {/* Bio and Location */}
            <p className="mt-4 text-gray-300">{profile.bio || 'No bio yet'}</p>
            
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-400">
              {profile.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {profile.location}
                </div>
              )}
              {profile.country && (
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  {profile.country}
                </div>
              )}
              {profile.timezone && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {profile.timezone}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="mt-4 flex gap-6 text-sm">
              <div>
                <span className="text-white font-bold">{profile.followers.length}</span>
                <span className="text-gray-400 ml-1">Followers</span>
              </div>
              <div>
                <span className="text-white font-bold">{profile.following.length}</span>
                <span className="text-gray-400 ml-1">Following</span>
              </div>
              <div>
                <span className="text-white font-bold">{profile.teams.length}</span>
                <span className="text-gray-400 ml-1">Teams</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <EditProfileModal
          profile={profile}
          onClose={() => setIsEditing(false)}
        />
      )}
    </div>
  );
}