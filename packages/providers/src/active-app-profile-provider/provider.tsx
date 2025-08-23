import { AppId, HUB_BASE_URL, LOGIN_BASE_URL } from '@dimasbaguspm/constants';
import { FC, ReactNode } from 'react';

import { useAuthProvider } from '../auth-provider';

import { ActiveAppProfileContext } from './context';

interface Props {
  appId: AppId;
  children: ReactNode;
}

export const ActiveAppProfileProvider: FC<Props> = (props) => {
  const { user, groupMembers, activeProfile } = useAuthProvider();

  const { appId, children } = props;

  if (!activeProfile) {
    const url = new URL(HUB_BASE_URL);
    window.location.href = url.toString();
  }

  const url = new URL(LOGIN_BASE_URL + '/verify-app-access');
  if (activeProfile?.appId !== appId) {
    window.location.href = url.toString();
  }

  if (activeProfile?.userId && activeProfile.userId !== user.id) {
    window.location.href = url.toString();
  }

  if (
    activeProfile?.groupId &&
    !groupMembers.some((member) => member.groupId === activeProfile.groupId)
  ) {
    window.location.href = url.toString();
  }

  return (
    <ActiveAppProfileContext.Provider value={activeProfile}>
      {children}
    </ActiveAppProfileContext.Provider>
  );
};
