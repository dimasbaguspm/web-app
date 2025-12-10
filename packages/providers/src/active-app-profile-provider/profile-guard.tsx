import { FC, PropsWithChildren, useEffect, useState } from 'react';

import { ProfileSwitcherModal } from './components/profile-switcher-modal';
import { ProfileVerifierModal } from './components/profile-verifier-modal';
import { useActiveAppProfile } from './use-active-app-profile';

interface ProfileAuthGuardProps {
  disableProfileVerification?: boolean;
}

export const ProfileAuthGuard: FC<PropsWithChildren<ProfileAuthGuardProps>> = ({
  children,
  disableProfileVerification = false,
}) => {
  const { hasProfile, isDifferentApp, shouldVerifyProfileOwnership, refetchProfile } = useActiveAppProfile();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const handleSuccessfulAuth = () => {
    setIsAuthenticated(true);
  };

  useEffect(() => {
    if (!shouldVerifyProfileOwnership) return;

    const handleVisibility = () => {
      if (document.hidden) setIsAuthenticated(false);
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [shouldVerifyProfileOwnership]);

  if (!hasProfile || isDifferentApp) {
    return <ProfileSwitcherModal onSubmit={refetchProfile} />;
  }

  if (shouldVerifyProfileOwnership && !disableProfileVerification) {
    if (!isAuthenticated) {
      return <ProfileVerifierModal onSubmit={handleSuccessfulAuth} />;
    }
  }

  return children;
};
