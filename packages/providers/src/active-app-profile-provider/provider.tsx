import { LOGIN_BASE_URL } from '@dimasbaguspm/constants';
import { FC, ReactNode } from 'react';

import { useAuthProvider } from '../auth-provider';

import { ActiveAppProfileContext } from './context';

interface Props {
  appId: number;
  children: ReactNode;
}

export const ActiveAppProfileProvider: FC<Props> = (props) => {
  const { user, groupMembers, activeProfile } = useAuthProvider();

  const { appId, children } = props;

  const url = new URL(LOGIN_BASE_URL + '/verify-app-access');

  if (!activeProfile) {
    window.location.href = url.toString();
  }

  url.searchParams.set('redirectTo', window.location.href);

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
  console.log('bar');

  return (
    <ActiveAppProfileContext.Provider value={activeProfile}>
      {children}
    </ActiveAppProfileContext.Provider>
  );
};
