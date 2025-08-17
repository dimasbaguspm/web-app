import { FC, PropsWithChildren } from 'react';

import { useProfilesData } from '../hooks';

import { ProfilesContext } from './context';

export const ProfilesProvider: FC<PropsWithChildren> = ({ children }) => {
  const profilesData = useProfilesData();

  return (
    <ProfilesContext.Provider value={profilesData}>
      {children}
    </ProfilesContext.Provider>
  );
};
