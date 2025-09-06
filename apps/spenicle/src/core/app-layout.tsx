import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useAuthProvider } from '@dimasbaguspm/providers/auth-provider';
import { useBottomSheetRoute } from '@dimasbaguspm/providers/bottom-sheet-route-provider';
import { useModalRoute } from '@dimasbaguspm/providers/modal-route-provider';
import { nameToInitials } from '@dimasbaguspm/utils/initial';
import {
  Avatar,
  BottomBar,
  Brand,
  ButtonMenuIcon,
  Hr,
  Icon,
  PageLayout,
  PageLoader,
  Text,
  TopBar,
} from '@dimasbaguspm/versaur';
import {
  BoltIcon,
  ChevronsLeftRightEllipsisIcon,
  EllipsisIcon,
  LogOutIcon,
  MoreHorizontalIcon,
  NotebookPenIcon,
} from 'lucide-react';
import { FC, PropsWithChildren, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { BOTTOM_SHEET_ROUTES } from '../constants/bottom-sheet-routes';
import { MODAL_ROUTES } from '../constants/modal-routes';
import { DEEP_LINKS } from '../constants/page-routes';

export const AppLayout: FC<PropsWithChildren> = ({ children }) => {
  const { isMobile, isTablet, isDesktop } = useWindowResize();

  const { user } = useAuthProvider();
  const { openModal } = useModalRoute();
  const { openBottomSheet } = useBottomSheetRoute();

  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => () => {
    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const LINKS = [DEEP_LINKS.TRANSACTIONS_ALT, DEEP_LINKS.ACCOUNTS, DEEP_LINKS.CATEGORIES, DEEP_LINKS.SUMMARY];

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
                  location.pathname.startsWith(DEEP_LINKS.TRANSACTIONS_ALT.path);

                return (
                  <TopBar.NavItem
                    key={link.path}
                    active={link.path === DEEP_LINKS.TRANSACTIONS_ALT.path ? isTransactionPageActive : isActiveLink}
                    onClick={handleNavigation(link.path)}
                  >
                    {link.title}
                  </TopBar.NavItem>
                );
              })}
            </TopBar.Nav>
          </TopBar.Leading>
          <TopBar.Trailing>
            <Avatar size="md">{nameToInitials(user.name)}</Avatar>
            <ButtonMenuIcon variant="ghost" aria-label="Profile Menu" as={EllipsisIcon}>
              <ButtonMenuIcon.Item onClick={() => openModal(MODAL_ROUTES.PROFILE_SWITCHER)}>
                <Icon as={ChevronsLeftRightEllipsisIcon} size="sm" color="inherit" />
                Switch Profile
              </ButtonMenuIcon.Item>
              <ButtonMenuIcon.Item onClick={handleNavigation(DEEP_LINKS.SETTINGS.path)}>
                <Icon as={BoltIcon} size="sm" color="inherit" />
                Settings
              </ButtonMenuIcon.Item>
              <ButtonMenuIcon.Item>
                <Icon as={NotebookPenIcon} size="sm" color="inherit" />
                Feedback
              </ButtonMenuIcon.Item>
              <Hr />
              <ButtonMenuIcon.Item onClick={() => openModal(MODAL_ROUTES.LOGOUT_CONFIRMATION)}>
                <Icon as={LogOutIcon} size="sm" color="inherit" />
                Logout
              </ButtonMenuIcon.Item>
              <Hr />
              <Text className="text-xs" color="gray" align="center">
                {__APP_VERSION__}
              </Text>
            </ButtonMenuIcon>
          </TopBar.Trailing>
        </TopBar>
      )}

      <main className="flex-grow-1 relative overflow-y-scroll overscroll-container">
        <PageLayout type={isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}>
          <Suspense fallback={<PageLoader />}>{children}</Suspense>
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
                className="h-16"
                icon={<Icon as={link.icon} size="md" color={isActiveLink ? 'primary' : 'inherit'} />}
                onClick={handleNavigation(link.path)}
                active={isActiveLink}
              />
            );
          })}
          <BottomBar.Item onClick={() => openBottomSheet(BOTTOM_SHEET_ROUTES.MENU)}>
            <Icon
              as={MoreHorizontalIcon}
              size="md"
              color={isActive(DEEP_LINKS.SETTINGS.path) ? 'primary' : 'inherit'}
            />
          </BottomBar.Item>
        </BottomBar>
      )}
    </div>
  );
};
