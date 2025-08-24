import { AppId } from '@dimasbaguspm/constants';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { FC, ReactNode, useState } from 'react';

import { useAuthProvider } from '../auth-provider';

import { ActiveAppProfileContext } from './context';
import { ProfileSelector } from './profile-selector';

interface Props {
  appId: AppId;
  children: ReactNode;
}

export const ActiveAppProfileProvider: FC<Props> = (props) => {
  const { appId, children } = props;
  const [switchProfile, setSwitchProfile] = useState(false);

  const { isDesktop } = useWindowResize();

  const { activeProfile } = useAuthProvider();

  const handleSwitchProfile = () => {
    setSwitchProfile(true);
  };

  const isSwitchingProfile = Boolean(switchProfile && activeProfile);

  if (!activeProfile || switchProfile) {
    return (
      <ProfileSelector
        appId={appId}
        variant={isDesktop ? 'modal' : 'sheet'}
        isSwitchingProfile={isSwitchingProfile}
        onSuccess={() => setSwitchProfile(false)}
      />
    );
  }

  return (
    <ActiveAppProfileContext.Provider
      value={{
        ...activeProfile,
        toggleSwitchProfile: handleSwitchProfile,
        isSwitchingProfile,
      }}
    >
      {children}
    </ActiveAppProfileContext.Provider>
  );
};
