import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useActiveAppProfile } from '@dimasbaguspm/providers/active-app-profile-provider';
import { useAuthProvider } from '@dimasbaguspm/providers/auth-provider';
import { nameToInitials } from '@dimasbaguspm/utils/initial';
import {
  Avatar,
  BottomBar,
  Brand,
  Icon,
  LoadingIndicator,
  PageLayout,
  TopBar,
} from '@dimasbaguspm/versaur';
import { FC, PropsWithChildren, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { DEEP_LINKS } from '../constants/page-routes';

export const AppLayout: FC<PropsWithChildren> = ({ children }) => {
  const { isMobile, isTablet, isDesktop } = useWindowResize();

  const { user } = useAuthProvider();

  const { toggleSwitchProfile } = useActiveAppProfile();

  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => () => {
    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const LINKS = [
    DEEP_LINKS.TRANSACTIONS_ALT,
    DEEP_LINKS.ACCOUNTS,
    DEEP_LINKS.CATEGORIES,
    DEEP_LINKS.SUMMARY,
  ];

  return (
    <div className="flex flex-col h-dvh">
      {isDesktop && (
        <TopBar>
          <TopBar.Leading>
            <Brand
              name="spenicle"
              size="lg"
              shape="rounded"
              aria-label="Spenicle Logo"
              onClick={handleNavigation(DEEP_LINKS.TRANSACTIONS.path)}
            />
            <TopBar.Nav>
              {LINKS.map((link) => {
                const isActiveLink = isActive(link.path);

                const isTransactionPageActive =
                  DEEP_LINKS.TRANSACTIONS.path === location.pathname ||
                  location.pathname.startsWith(
                    DEEP_LINKS.TRANSACTIONS_ALT.path,
                  );

                return (
                  <TopBar.NavItem
                    key={link.path}
                    active={
                      link.path === DEEP_LINKS.TRANSACTIONS_ALT.path
                        ? isTransactionPageActive
                        : isActiveLink
                    }
                    onClick={handleNavigation(link.path)}
                  >
                    {link.title}
                  </TopBar.NavItem>
                );
              })}
            </TopBar.Nav>
          </TopBar.Leading>
          <TopBar.Trailing>
            <Avatar size="sm" onClick={toggleSwitchProfile}>
              {nameToInitials(user.name)}
            </Avatar>
          </TopBar.Trailing>
        </TopBar>
      )}

      <main className="flex-grow-1 relative overflow-y-scroll">
        <PageLayout
          type={isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}
        >
          <Suspense fallback={<LoadingIndicator type="bar" size="sm" />}>
            {children}
          </Suspense>
        </PageLayout>
      </main>

      {!isDesktop && (
        <BottomBar>
          {LINKS.map((link) => {
            const isActiveLink =
              link.path === DEEP_LINKS.TRANSACTIONS_ALT.path
                ? DEEP_LINKS.TRANSACTIONS.path === location.pathname ||
                  location.pathname.startsWith(DEEP_LINKS.TRANSACTIONS_ALT.path)
                : isActive(link.path);
            return (
              <BottomBar.Item
                key={link.path}
                icon={
                  <Icon
                    as={link.icon}
                    size="md"
                    color={isActiveLink ? 'primary' : 'inherit'}
                  />
                }
                label={link.title}
                onClick={handleNavigation(link.path)}
                active={isActiveLink}
              />
            );
          })}
        </BottomBar>
      )}
    </div>
  );
};
