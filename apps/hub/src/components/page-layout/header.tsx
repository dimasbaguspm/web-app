import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { nameToInitials } from '@dimasbaguspm/utils/initial';
import { Avatar, Brand, TopBar } from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { DEEP_LINKS } from '../../constants/routes';
import { useAuthProvider } from '../../providers/auth-provider';

export const Header: FC = () => {
  const { isMobile } = useWindowResize();
  const { user } = useAuthProvider();

  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => () => {
    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  if (isMobile) return null;

  return (
    <TopBar>
      <TopBar.Leading>
        <Brand
          name="spenicle"
          size="lg"
          shape="rounded"
          aria-label="Spenicle Logo"
          onClick={handleNavigation(DEEP_LINKS.MARKETPLACE.path)}
        />
        <TopBar.Nav>
          <TopBar.NavItem
            active={isActive(DEEP_LINKS.MARKETPLACE.path)}
            onClick={handleNavigation(DEEP_LINKS.MARKETPLACE.path)}
          >
            {DEEP_LINKS.MARKETPLACE.title}
          </TopBar.NavItem>
          <TopBar.NavItem
            active={isActive(DEEP_LINKS.GROUPS.path)}
            onClick={handleNavigation(DEEP_LINKS.GROUPS.path)}
          >
            {DEEP_LINKS.GROUPS.title}
          </TopBar.NavItem>
          <TopBar.NavItem
            active={isActive(DEEP_LINKS.PROFILES.path)}
            onClick={handleNavigation(DEEP_LINKS.PROFILES.path)}
          >
            {DEEP_LINKS.PROFILES.title}
          </TopBar.NavItem>
        </TopBar.Nav>
      </TopBar.Leading>
      <TopBar.Trailing>
        <Avatar size="sm">{nameToInitials(user.name)}</Avatar>
      </TopBar.Trailing>
    </TopBar>
  );
};
