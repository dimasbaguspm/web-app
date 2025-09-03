import { useActiveAppProfile } from '@dimasbaguspm/providers/active-app-profile-provider';
import { useModalRoute } from '@dimasbaguspm/providers/modal-route-provider';
import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';
import { nameToInitials } from '@dimasbaguspm/utils/initial';
import { Avatar, BottomSheet, Button, ButtonIcon, Hr, Icon, Text } from '@dimasbaguspm/versaur';
import { BoltIcon, ChevronsLeftRightEllipsisIcon, LogOutIcon, NotebookPenIcon, RefreshCwIcon } from 'lucide-react';
import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { MODAL_ROUTES } from '../../constants/modal-routes';
import { DEEP_LINKS } from '../../constants/page-routes';

export const MenuBottomSheet: FC = () => {
  const { openModal } = useModalRoute();
  const { profile } = useActiveAppProfile();

  const location = useLocation();
  const navigate = useNavigate();

  const curriedNavigate = (path: string) => () => navigate(path);

  const isActive = (path: string) => location.pathname === path;

  const handleChangeProfileClick = () => {
    openModal(MODAL_ROUTES.PROFILE_SWITCHER);
  };

  const handleOnLogoutClick = () => {
    openModal(MODAL_ROUTES.LOGOUT_CONFIRMATION);
  };

  return (
    <>
      <BottomSheet.Header />
      <BottomSheet.Body>
        <div className="flex justify-start items-center mb-4">
          <Avatar shape="rounded" size="lg">
            {nameToInitials(profile?.name)}
          </Avatar>
          <div className="ml-4 flex flex-col">
            <Text fontWeight="medium">{profile?.name}</Text>
            <Text fontSize="sm" color="gray">
              {formatDate(profile?.createdAt, DateFormat.FULL_DATE)}
            </Text>
          </div>
          <div className="flex-grow flex justify-end items-center">
            <ButtonIcon
              as={ChevronsLeftRightEllipsisIcon}
              variant="ghost"
              size="md"
              aria-label="Change profile"
              onClick={handleChangeProfileClick}
            />
          </div>
        </div>

        <ul className="flex flex-col">
          <li>
            <Button
              variant={isActive(DEEP_LINKS.SETTINGS.path) ? 'primary-ghost' : 'ghost'}
              className="w-full justify-start"
              onClick={curriedNavigate(DEEP_LINKS.SETTINGS.path)}
            >
              <Icon as={BoltIcon} size="sm" color="inherit" />
              Preferences
            </Button>
            <Hr />
          </li>
          <li>
            <Button
              variant={isActive(DEEP_LINKS.SETTINGS_SCHEDULED_PAYMENTS.path) ? 'primary-ghost' : 'ghost'}
              className="w-full justify-start"
              onClick={curriedNavigate(DEEP_LINKS.SETTINGS_SCHEDULED_PAYMENTS.path)}
            >
              <Icon as={RefreshCwIcon} size="sm" color="inherit" />
              Scheduled Payments
            </Button>
            <Hr />
          </li>
          <li>
            <Button variant="ghost" className="w-full justify-start">
              <Icon as={NotebookPenIcon} size="sm" color="inherit" />
              Feedback
            </Button>
          </li>
          <li>
            <Button variant="ghost" className="w-full justify-start" onClick={handleOnLogoutClick}>
              <Icon as={LogOutIcon} size="sm" color="inherit" />
              Logout
            </Button>
          </li>
          <Hr />
        </ul>
      </BottomSheet.Body>
      <BottomSheet.Footer className="mx-auto">
        <Text fontSize="sm" color="gray">
          Version {__APP_VERSION__}
        </Text>
      </BottomSheet.Footer>
    </>
  );
};
