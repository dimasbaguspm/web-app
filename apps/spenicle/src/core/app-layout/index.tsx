import { AppLayout, MatchMedia, MobileBreakpoint, PageLoader } from '@dimasbaguspm/versaur';
import { FC, PropsWithChildren, Suspense } from 'react';

import { AppBottomBar } from './app-bottom-bar';
import { AppTopBar } from './app-top-bar';

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <AppLayout>
      <MatchMedia query="(min-width: 768px)">
        <AppLayout.TopRegion>
          <AppTopBar />
        </AppLayout.TopRegion>
      </MatchMedia>
      <AppLayout.MainRegion>
        <Suspense fallback={<PageLoader />}>{children}</Suspense>
      </AppLayout.MainRegion>
      <MobileBreakpoint>
        <AppLayout.BottomRegion>
          <AppBottomBar />
        </AppLayout.BottomRegion>
      </MobileBreakpoint>
    </AppLayout>
  );
};
