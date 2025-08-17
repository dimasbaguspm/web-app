import { FC } from 'react';

import { useProfilesContext } from '../context';

import { ProfileCard } from './profile-card';

import type { ProfileWithApp } from '../types';

export const ProfilesGrid: FC = () => {
  const { profiles, onDeleteProfile, onPlayProfile } = useProfilesContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {profiles.map((profile: ProfileWithApp) => (
        <ProfileCard
          key={profile.id}
          profile={profile}
          onDelete={onDeleteProfile}
          onPlay={onPlayProfile}
        />
      ))}
    </div>
  );
};
