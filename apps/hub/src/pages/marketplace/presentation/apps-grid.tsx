import { FC } from 'react';

import { useMarketplaceContext } from '../context/context';

import { AppCard } from './app-card';

import type { AppProfile } from '../types';

interface AppsGridProps {
  profiles: AppProfile[];
  variant: 'user' | 'group' | 'available';
}

export const AppsGrid: FC<AppsGridProps> = ({ profiles, variant }) => {
  const { data } = useMarketplaceContext();

  if (variant === 'available') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.availableApps.map((app) => (
          <AppCard key={app.id} app={app} variant="available" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {profiles.map((profile) => {
        const app = data.appsMap.get(profile.appId);
        if (!app) return null;

        const isUserProfile = variant === 'user';
        const groupName = isUserProfile
          ? null
          : data.groupsMap.get(profile.groupId!)?.name;

        return (
          <AppCard
            key={profile.id}
            app={app}
            groupName={groupName}
            isUserProfile={isUserProfile}
            profile={profile}
            variant="installed"
          />
        );
      })}
    </div>
  );
};
