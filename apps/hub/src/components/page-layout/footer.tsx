import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { BottomBar, Icon } from '@dimasbaguspm/versaur';
import { SettingsIcon, StoreIcon, User2Icon, UsersIcon } from 'lucide-react';
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
        icon={<Icon as={StoreIcon} size="md" />}
        label="Marketplace"
        onClick={handleNavigation(DEEP_LINKS.MARKETPLACE.path)}
        active={location.pathname === DEEP_LINKS.MARKETPLACE.path}
      />
      <BottomBar.Item
        icon={<Icon as={UsersIcon} size="md" />}
        label="Groups"
        onClick={handleNavigation(DEEP_LINKS.GROUPS.path)}
        active={isActive(DEEP_LINKS.GROUPS.path)}
      />
      <BottomBar.Item
        icon={<Icon as={User2Icon} size="md" />}
        label="Profiles"
        onClick={handleNavigation(DEEP_LINKS.PROFILES.path)}
        active={isActive(DEEP_LINKS.PROFILES.path)}
      />
      <BottomBar.Item
        icon={<Icon as={SettingsIcon} size="md" />}
        label="Account"
        onClick={handleNavigation(DEEP_LINKS.ACCOUNTS.path)}
        active={isActive(DEEP_LINKS.ACCOUNTS.path)}
      />
    </BottomBar>
  );
};
