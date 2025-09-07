import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useActiveAppProfile } from '@dimasbaguspm/providers/active-app-profile-provider';
import { useModalRoute } from '@dimasbaguspm/providers/modal-route-provider';
import { nameToInitials } from '@dimasbaguspm/utils/initial';
import { Avatar, Brand, ButtonMenuIcon, Hr, Icon, Text, TopBar } from '@dimasbaguspm/versaur';
import { BoltIcon, ChevronsLeftRightEllipsisIcon, EllipsisIcon, LogOutIcon, NotebookPenIcon } from 'lucide-react';
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

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  if (!isDesktop) return null;

  return (
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
        <Avatar size="md">{nameToInitials(profile.name)}</Avatar>
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
          <Text fontSize="xs" color="gray" align="center">
            {__APP_VERSION__}
          </Text>
        </ButtonMenuIcon>
      </TopBar.Trailing>
    </TopBar>
  );
};
