import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { User } from '../../types';
import { useAuthStore } from '../../lib/store';
import ProfileHeader from './ProfileHeader';
import ProfileStats from './ProfileStats';
import GamesList from './GamesList';
import TeamsList from './TeamsList';
import AchievementsList from './AchievementsList';
import ProfileWall from './ProfileWall';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorDisplay from '../shared/ErrorDisplay';

export default function UserProfile() {
  const { userId } = useParams();
  const { user: currentUser } = useAuthStore();
  
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const docRef = doc(db, 'users', userId!);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error('Profile not found');
      }
      return docSnap.data() as User;
    }
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;
  if (!profile) return null;

  const isOwnProfile = currentUser?.id === profile.id;

  return (
    <div className="max-w-7xl mx-auto">
      <ProfileHeader 
        profile={profile} 
        isOwnProfile={isOwnProfile} 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <ProfileStats stats={profile.stats} />
          <GamesList games={profile.gamesPlayed} isEditable={isOwnProfile} />
          <ProfileWall userId={profile.id} isOwnProfile={isOwnProfile} />
        </div>
        
        <div className="space-y-6">
          <TeamsList teams={profile.teams} />
          <AchievementsList achievements={profile.achievements} />
        </div>
      </div>
    </div>
  );
}