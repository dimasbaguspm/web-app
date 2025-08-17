import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { LoadingIndicator } from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';

import { DEEP_LINKS } from '../../constants/routes';

import { useMarketplaceContext } from './context/context';
import { MarketplaceProvider } from './context/provider';
import { DesktopHeader } from './presentation/desktop-header';
import { MobileHeader } from './presentation/mobile-header';

const MarketplaceContent: FC = () => {
  const { loading } = useMarketplaceContext();
  const { isDesktop } = useWindowResize();

  const isLoading = loading.apps || loading.appProfiles;

  if (isLoading) {
    return <LoadingIndicator size="sm" type="bar" />;
  }

  return (
    <>
      {isDesktop ? <DesktopHeader /> : <MobileHeader />}

      <div className="px-4 space-y-12">
        <Outlet />
      </div>
    </>
  );
};

const MarketplacePage: FC = () => {
  const { pathname } = useLocation();

  if (pathname === DEEP_LINKS.MARKETPLACE.path) {
    return <Navigate to={DEEP_LINKS.MARKETPLACE_AVAILABLE.path} replace />;
  }

  return (
    <MarketplaceProvider>
      <MarketplaceContent />
    </MarketplaceProvider>
  );
};

export default MarketplacePage;
