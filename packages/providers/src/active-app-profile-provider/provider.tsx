import { AppId } from '@dimasbaguspm/constants';
import { useApiHiAppProfileQuery } from '@dimasbaguspm/hooks/use-api';
import { PageLoader } from '@dimasbaguspm/versaur';
import { FC, ReactNode } from 'react';

import { useAuthProvider } from '../auth-provider';

import { ActiveAppProfileContext } from './context';

interface Props {
  appId: AppId;
  children: ReactNode;
}

export const ActiveAppProfileProvider: FC<Props> = (props) => {
  const { children } = props;

  const { activeProfile, refetch } = useAuthProvider();

  const [activeProfileData] = useApiHiAppProfileQuery(activeProfile?.id ? +activeProfile.id : -1, {
    enabled: !!activeProfile,
  });

  const refetchProfile = async () => {
    await refetch();
  };

  if (activeProfile && !activeProfileData) {
    return <PageLoader fullscreen />;
  }

  return (
    <ActiveAppProfileContext.Provider
      value={{
        hasProfile: !!activeProfileData || !!activeProfile,
        profile: activeProfileData!,
        refetchProfile,
      }}
    >
      {children}
    </ActiveAppProfileContext.Provider>
  );
};
