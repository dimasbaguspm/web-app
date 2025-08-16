import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { BottomBar, Icon } from '@dimasbaguspm/versaur';
import { HomeIcon, StoreIcon, UserIcon } from 'lucide-react';
import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { DEEP_LINKS } from '../../constants/routes';

export const Footer: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isMobile } = useWindowResize();

  if (!isMobile) return null;

  const handleNavigation = (path: string) => () => {
    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <BottomBar>
      <BottomBar.Item
        icon={<Icon as={HomeIcon} size="md" />}
        label="Home"
        active={location.pathname === DEEP_LINKS.DASHBOARD.path}
        onClick={handleNavigation(DEEP_LINKS.DASHBOARD.path)}
      />
      <BottomBar.Item
        icon={<Icon as={StoreIcon} size="md" />}
        label="Marketplace"
        onClick={handleNavigation(DEEP_LINKS.MARKETPLACE.path)}
        active={isActive(DEEP_LINKS.MARKETPLACE.path)}
      />
      <BottomBar.Item
        icon={<Icon as={UserIcon} size="md" />}
        label="Profile"
        onClick={handleNavigation(DEEP_LINKS.PROFILE.path)}
        active={isActive(DEEP_LINKS.PROFILE.path)}
      />
    </BottomBar>
  );
};
