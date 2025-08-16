import { Skeleton } from '@dimasbaguspm/versaur';
import { Suspense } from 'react';
import { Outlet } from 'react-router';

import { Footer } from './footer';
import { Header } from './header';

export const PageLayout = () => {
  return (
    <div className="flex flex-col h-screen ">
      <Header />

      <main className="flex-grow-1 relative overflow-y-scroll">
        <Suspense fallback={<Skeleton size="xl" />}>
          <Outlet />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
};
