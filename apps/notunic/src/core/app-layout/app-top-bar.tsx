import { HUB_BASE_URL } from '@dimasbaguspm/constants';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useActiveAppProfile } from '@dimasbaguspm/providers/active-app-profile-provider';
import { useModalRoute } from '@dimasbaguspm/providers/modal-route-provider';
import { nameToInitials } from '@dimasbaguspm/utils/initial';
import { Avatar, Brand, ButtonMenuIcon, Hr, Icon, Text, TopBar } from '@dimasbaguspm/versaur';
import { ChevronsLeftRightEllipsisIcon, EllipsisIcon, LogOutIcon, NotebookPenIcon, OrbitIcon } from 'lucide-react';
import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { MODAL_ROUTES } from '../../constants/modal-routes';
import { DEEP_LINKS } from '../../constants/page-routes';

import { LINKS } from './constants';

export const AppTopBar: FC = () => {
  const { profile } = useActiveAppProfile();
  const { isDesktop } = useWindowResize();
  const location = useLocation();

  const { openModal } = useModalRoute();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => () => {
    navigate(path);
  };

  const handleNavigateToMarketplace = () => {
    window.open(HUB_BASE_URL, '_blank');
  };

  const isActive = (path: string) => {
    if (path === DEEP_LINKS.SPACES.path) {
      return location.pathname === DEEP_LINKS.SPACES.path;
    }

    return location.pathname.startsWith(path);
  };

  if (!isDesktop) return null;

  return (
    <TopBar>
      <TopBar.Leading>
        <Brand
          name="notunic"
          size="lg"
          shape="rounded"
          aria-label="Notunic Logo"
          onClick={handleNavigation(DEEP_LINKS.SPACES.path)}
        />
        <TopBar.Nav>
          {LINKS.map((link) => {
            const isActiveLink = isActive(link.path);

            return (
              <TopBar.NavItem key={link.path} active={isActiveLink} onClick={handleNavigation(link.path)}>
                {link.title}
              </TopBar.NavItem>
            );
          })}
        </TopBar.Nav>
      </TopBar.Leading>
      <TopBar.Trailing>
        <Avatar size="md">{nameToInitials(profile.name)}</Avatar>
        <ButtonMenuIcon variant="ghost" aria-label="Profile Menu" as={EllipsisIcon}>
          <ButtonMenuIcon.Item onClick={() => openModal(MODAL_ROUTES.PROFILE_SWITCHER)}>
            <Icon as={ChevronsLeftRightEllipsisIcon} size="sm" color="inherit" />
            Switch Profile
          </ButtonMenuIcon.Item>
          <ButtonMenuIcon.Item onClick={handleNavigateToMarketplace}>
            <Icon as={OrbitIcon} size="sm" color="inherit" />
            Marketplace
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
          <Text fontSize="xs" color="gray" align="center">
            {__APP_VERSION__}
          </Text>
        </ButtonMenuIcon>
      </TopBar.Trailing>
    </TopBar>
  );
};
