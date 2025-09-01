import { useActiveAppProfile } from '@dimasbaguspm/providers/active-app-profile-provider';
import { useBottomSheetRoute } from '@dimasbaguspm/providers/bottom-sheet-route-provider';
import { useModalRoute } from '@dimasbaguspm/providers/modal-route-provider';
import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';
import { nameToInitials } from '@dimasbaguspm/utils/initial';
import { Avatar, BottomSheet, Button, ButtonIcon, Hr, Icon, Text } from '@dimasbaguspm/versaur';
import { BoltIcon, ChevronsLeftRightEllipsisIcon, LogOutIcon, NotebookPenIcon } from 'lucide-react';
import { FC } from 'react';
import { useNavigate } from 'react-router';

import { BOTTOM_SHEET_ROUTES } from '../../constants/bottom-sheet-routes';
import { MODAL_ROUTES } from '../../constants/modal-routes';
import { DEEP_LINKS } from '../../constants/page-routes';

export const MenuBottomSheet: FC = () => {
  const { openBottomSheet } = useBottomSheetRoute();
  const { openModal } = useModalRoute();
  const { profile } = useActiveAppProfile();

  const navigate = useNavigate();

  const curriedNavigate = (path: string) => () => navigate(path);

  const handleChangeProfileClick = () => {
    openBottomSheet(BOTTOM_SHEET_ROUTES.PROFILE_SWITCHER);
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
            {nameToInitials(profile.name)}
          </Avatar>
          <div className="ml-4 flex flex-col">
            <Text fontWeight="medium">{profile.name}</Text>
            <Text fontSize="sm" color="gray">
              {formatDate(profile.createdAt, DateFormat.FULL_DATE)}
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

        <ul className="gap-2 flex flex-col">
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={curriedNavigate(DEEP_LINKS.SETTINGS.path)}
            >
              <Icon as={BoltIcon} size="sm" color="inherit" />
              Settings
            </Button>
          </li>
          <Hr />
          <li>
            <Button variant="ghost" className="w-full justify-start">
              <Icon as={NotebookPenIcon} size="sm" color="inherit" />
              Feedback
            </Button>
          </li>
          <Hr />
          <li>
            <Button variant="ghost" className="w-full justify-start" onClick={handleOnLogoutClick}>
              <Icon as={LogOutIcon} size="sm" color="danger" />
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
