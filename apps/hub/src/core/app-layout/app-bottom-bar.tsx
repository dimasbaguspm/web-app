import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useAuthProvider } from '@dimasbaguspm/providers/auth-provider';
import { BottomBar, Icon } from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { useNavigate } from 'react-router';

import { DEEP_LINKS } from '../../constants/page-routes';

import { getNavigationLinks } from './helpers';

export const AppBottomBar: FC = () => {
  const { isAdmin } = useAuthProvider();
  const { isDesktop } = useWindowResize();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => () => {
    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  if (isDesktop) return null;

  const navLinks = [...getNavigationLinks(isAdmin), DEEP_LINKS.SETTINGS];

  return (
    <BottomBar>
      {navLinks.map((link) => {
        return (
          <BottomBar.Item
            key={link.path}
            className="h-16"
            icon={<Icon as={link.icon} size="md" color={isActive(link.path) ? 'primary' : 'inherit'} />}
            onClick={handleNavigation(link.path)}
            active={isActive(link.path)}
          />
        );
      })}
    </BottomBar>
  );
};
