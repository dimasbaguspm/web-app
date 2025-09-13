import { useActiveAppProfile } from '@dimasbaguspm/providers/active-app-profile-provider';
import { Modal } from '@dimasbaguspm/versaur';
import { FC, PropsWithChildren } from 'react';

import { ProfileSwitcherModal } from '../modals/profile-switcher-modal/modal';

export const AppSession: FC<PropsWithChildren> = ({ children }) => {
  const { hasProfile, refetchProfile } = useActiveAppProfile();

  if (!hasProfile) {
    return (
      <Modal disableEscapeKeyDown disableOverlayClickToClose isOpen onClose={refetchProfile}>
        <ProfileSwitcherModal isSessionCheck />
      </Modal>
    );
  }

  return children;
};
