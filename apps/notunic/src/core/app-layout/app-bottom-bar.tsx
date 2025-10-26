import { useBottomSheetRoute } from '@dimasbaguspm/providers/bottom-sheet-route-provider';
import { BottomBar, Icon } from '@dimasbaguspm/versaur';
import { MoreHorizontalIcon } from 'lucide-react';
import { FC } from 'react';
import { useNavigate } from 'react-router';

import { BOTTOM_SHEET_ROUTES } from '../../constants/bottom-sheet-routes';
import { DEEP_LINKS } from '../../constants/page-routes';

import { LINKS } from './constants';

export const AppBottomBar: FC = () => {
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

  return (
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

      <BottomBar.Item
        onClick={() => openBottomSheet(BOTTOM_SHEET_ROUTES.MENU)}
        active={isActive(DEEP_LINKS.SETTINGS.path)}
      >
        <Icon as={MoreHorizontalIcon} size="md" color={'inherit'} />
      </BottomBar.Item>
    </BottomBar>
  );
};
