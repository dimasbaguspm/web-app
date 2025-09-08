import { FC, PropsWithChildren } from 'react';

import { AppBottomBar } from './app-bottom-bar';
import { AppCenterContainer } from './app-center-container';
import { AppTopBar } from './app-top-bar';

export const AppLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-dvh">
      <AppTopBar />
      <AppCenterContainer>{children}</AppCenterContainer>
      <AppBottomBar />
    </div>
  );
};
