import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { LoadingIndicator, PageLayout as VersaurPageLayout } from '@dimasbaguspm/versaur';
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
        <VersaurPageLayout type={isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}>
          <Suspense fallback={<LoadingIndicator type="bar" size="sm" />}>
            <Outlet />
          </Suspense>
        </VersaurPageLayout>
      </main>

      <Footer />
    </div>
  );
};
