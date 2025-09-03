import { AppId } from '@dimasbaguspm/constants';
import { useApiHiAppProfileQuery } from '@dimasbaguspm/hooks/use-api';
import { FC, ReactNode, useState } from 'react';

import { useAuthProvider } from '../auth-provider';

import { ActiveAppProfileContext } from './context';

interface Props {
  appId: AppId;
  children: ReactNode;
  profileSwitcher: ReactNode;
}

export const ActiveAppProfileProvider: FC<Props> = (props) => {
  const { children, profileSwitcher } = props;
  const [switchProfile, setSwitchProfile] = useState(false);

  const { activeProfile } = useAuthProvider();

  const [activeProfileData, , { isFetching }] = useApiHiAppProfileQuery(activeProfile?.id ? +activeProfile.id : -1, {
    enabled: !!activeProfile,
  });

  const handleSwitchProfile = () => {
    setSwitchProfile(true);
  };

  const isSwitchingProfile = Boolean(switchProfile && activeProfile);

  if (isFetching) return null;

  if (!activeProfile || !activeProfileData || switchProfile) {
    return profileSwitcher;
  }

  return (
    <ActiveAppProfileContext.Provider
      value={{
        profile: activeProfileData,
        toggleSwitchProfile: handleSwitchProfile,
        isSwitchingProfile,
      }}
    >
      {children}
    </ActiveAppProfileContext.Provider>
  );
};
