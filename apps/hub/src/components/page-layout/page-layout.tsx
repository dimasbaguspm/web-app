import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import {
  Skeleton,
  PageLayout as VersaurPageLayout,
} from '@dimasbaguspm/versaur';
import { cx } from 'class-variance-authority';
import { Suspense } from 'react';
import { Outlet } from 'react-router';

import { Footer } from './footer';
import { Header } from './header';

export const PageLayout = () => {
  const { isTablet, isMobile } = useWindowResize();
  return (
    <div className="flex flex-col h-screen ">
      <Header />

      <main className="flex-grow-1 relative overflow-y-scroll">
        <VersaurPageLayout
          type={isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}
          className={cx(isMobile && 'px-4 pt-2')}
        >
          <Suspense fallback={<Skeleton size="xl" />}>
            <Outlet />
          </Suspense>
        </VersaurPageLayout>
      </main>

      <Footer />
    </div>
  );
};
