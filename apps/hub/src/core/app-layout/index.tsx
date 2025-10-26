import { AppLayout, MobileBreakpoint, PageLoader, TabletAndDesktopBreakpoint } from '@dimasbaguspm/versaur';
import { FC, PropsWithChildren, Suspense } from 'react';

import { AppBottomBar } from './app-bottom-bar';
import { AppTopBar } from './app-top-bar';

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <AppLayout>
      <TabletAndDesktopBreakpoint>
        <AppLayout.TopRegion>
          <AppTopBar />
        </AppLayout.TopRegion>
      </TabletAndDesktopBreakpoint>
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
