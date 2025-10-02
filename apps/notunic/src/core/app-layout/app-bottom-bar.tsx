import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useBottomSheetRoute } from '@dimasbaguspm/providers/bottom-sheet-route-provider';
import { PortalShifter } from '@dimasbaguspm/providers/portal-provider';
import { BottomBar, Icon } from '@dimasbaguspm/versaur';
import { MoreHorizontalIcon } from 'lucide-react';
import { FC } from 'react';
import { useNavigate } from 'react-router';

import { BOTTOM_SHEET_ROUTES } from '../../constants/bottom-sheet-routes';
import { DEEP_LINKS } from '../../constants/page-routes';
import { PORTAL_ROUTES } from '../../constants/portal-routes';

import { LINKS } from './constants';

export const AppBottomBar: FC = () => {
  const { isDesktop } = useWindowResize();
  const { openBottomSheet } = useBottomSheetRoute();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => () => {
    navigate(path);
  };

  const isActive = (path: string) => {
    if (path === DEEP_LINKS.SPACES.path) {
      return location.pathname === DEEP_LINKS.SPACES.path;
    }

    return location.pathname.startsWith(path);
  };

  // Hide bottom bar on thread detail page due to show the chat input at the bottom
  return (
    <PortalShifter id={PORTAL_ROUTES.BOTTOM_BAR}>
      {!isDesktop && (
        <BottomBar>
          {LINKS.map((link) => {
            const isActiveLink = isActive(link.path);
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
            <Icon as={MoreHorizontalIcon} size="md" color={'inherit'} />
          </BottomBar.Item>
        </BottomBar>
      )}
    </PortalShifter>
  );
};
