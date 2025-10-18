import { PageLoader } from '@dimasbaguspm/versaur';
import { FC, PropsWithChildren, Suspense } from 'react';

export const AppCenterContainer: FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className="flex-grow-1 relative overflow-y-scroll overscroll-container">
      <Suspense fallback={<PageLoader />}>{children}</Suspense>
    </main>
  );
};
