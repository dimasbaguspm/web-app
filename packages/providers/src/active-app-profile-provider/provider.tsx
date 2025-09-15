import { useApiHiAppProfileQuery } from '@dimasbaguspm/hooks/use-api';
import { PageLoader } from '@dimasbaguspm/versaur';
import { FC, ReactNode } from 'react';

import { useAuthProvider } from '../auth-provider';
import { useGlobalProvider } from '../global-provider';

import { ActiveAppProfileContext } from './context';

interface Props {
  children: ReactNode;
}

export const ActiveAppProfileProvider: FC<Props> = (props) => {
  const { children } = props;

  const { appId } = useGlobalProvider();
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

  const isDifferentApp = activeProfileData?.appId !== appId;
  const shouldVerifyProfileOwnership = !!activeProfileData && activeProfileData.hasAuth;

  return (
    <ActiveAppProfileContext.Provider
      value={{
        hasProfile: !!activeProfileData || !!activeProfile,
        profile: activeProfileData!,
        refetchProfile,
        isDifferentApp,
        shouldVerifyProfileOwnership,
      }}
    >
      {children}
    </ActiveAppProfileContext.Provider>
  );
};
