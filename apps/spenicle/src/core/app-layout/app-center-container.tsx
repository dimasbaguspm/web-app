import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { PageLayout, PageLoader } from '@dimasbaguspm/versaur';
import { FC, PropsWithChildren, Suspense } from 'react';

export const AppCenterContainer: FC<PropsWithChildren> = ({ children }) => {
  const { isMobile, isTablet } = useWindowResize();

  return (
    <main className="flex-grow-1 relative overflow-y-scroll overscroll-container">
      <PageLayout type={isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}>
        <Suspense fallback={<PageLoader />}>{children}</Suspense>
      </PageLayout>
    </main>
  );
};
