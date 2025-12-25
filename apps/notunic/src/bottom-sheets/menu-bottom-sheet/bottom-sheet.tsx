import { HUB_BASE_URL } from '@dimasbaguspm/constants';
import { useActiveAppProfile } from '@dimasbaguspm/providers/active-app-profile-provider';
import { useModalRoute } from '@dimasbaguspm/providers/modal-route-provider';
import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';
import { nameToInitials } from '@dimasbaguspm/utils/initial';
import { Avatar, BottomSheet, Button, ButtonIcon, Hr, Icon, Text } from '@dimasbaguspm/versaur';
import { BoltIcon, ChevronsLeftRightEllipsisIcon, LogOutIcon, NotebookPenIcon, OrbitIcon } from 'lucide-react';
import { FC } from 'react';
import { useNavigate } from 'react-router';

import { MODAL_ROUTES } from '../../constants/modal-routes';
import { ROUTES } from '../../constants/page-routes';

export const MenuBottomSheet: FC = () => {
  const { openModal } = useModalRoute();
  const { profile } = useActiveAppProfile();
  const navigate = useNavigate();

  const handleChangeProfileClick = () => {
    openModal(MODAL_ROUTES.PROFILE_SWITCHER);
  };

  const handleOnLogoutClick = () => {
    openModal(MODAL_ROUTES.LOGOUT_CONFIRMATION);
  };

  const handleOnSettingsClick = () => {
    navigate(ROUTES.SETTINGS);
  };

  const handleNavigateToMarketplace = () => {
    window.open(HUB_BASE_URL, '_blank');
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
            <Text as="small" color="gray">
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

        <ul className="flex flex-col gap-1">
          <li>
            <Hr />
          </li>
          <li>
            <Button variant="ghost" className="w-full justify-start">
              <Icon as={NotebookPenIcon} size="sm" color="inherit" />
              Feedback
            </Button>
          </li>
          <li>
            <Hr />
          </li>
          <li>
            <Button variant="ghost" className="w-full justify-start" onClick={handleNavigateToMarketplace}>
              <Icon as={OrbitIcon} size="sm" color="inherit" />
              Marketplace
            </Button>
          </li>
          <li>
            <Hr />
          </li>

          <li>
            <Button variant="ghost" className="w-full justify-start" onClick={handleOnSettingsClick}>
              <Icon as={BoltIcon} size="sm" color="inherit" />
              Settings
            </Button>
          </li>
          <li>
            <Hr />
          </li>
          <li>
            <Button variant="ghost" className="w-full justify-start" onClick={handleOnLogoutClick}>
              <Icon as={LogOutIcon} size="sm" color="inherit" />
              Logout
            </Button>
          </li>
          <li>
            <Hr />
          </li>
        </ul>
      </BottomSheet.Body>
      <BottomSheet.Footer className="mx-auto">
        <Text as="small" color="gray">
          Version {__APP_VERSION__}
        </Text>
      </BottomSheet.Footer>
    </>
  );
};
