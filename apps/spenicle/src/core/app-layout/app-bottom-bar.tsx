import { useBottomSheetRoute } from '@dimasbaguspm/providers/bottom-sheet-route-provider';
import { BottomBar, Icon } from '@dimasbaguspm/versaur';
import { Settings2Icon } from 'lucide-react';
import { FC } from 'react';
import { useNavigate } from 'react-router';

import { BOTTOM_SHEET_ROUTES } from '../../constants/bottom-sheet-routes';
import { DEEP_LINKS } from '../../constants/page-routes';

import { BOTTOM_BAR_LINKS } from './constants';

export const AppBottomBar: FC = () => {
  const navigate = useNavigate();
  const { openBottomSheet } = useBottomSheetRoute();

  const handleNavigation = (path: string) => () => {
    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <BottomBar>
      {BOTTOM_BAR_LINKS.map((link) => {
        const isActiveLink =
          link.path === DEEP_LINKS.TRANSACTIONS_ALT.path
            ? location.pathname.startsWith(DEEP_LINKS.TRANSACTIONS_ALT.path)
            : link.path === DEEP_LINKS.DASHBOARD.path
              ? location.pathname === DEEP_LINKS.DASHBOARD.path
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
        <Icon as={Settings2Icon} size="md" color={isActive(DEEP_LINKS.SETTINGS.path) ? 'primary' : 'inherit'} />
      </BottomBar.Item>
    </BottomBar>
  );
};
