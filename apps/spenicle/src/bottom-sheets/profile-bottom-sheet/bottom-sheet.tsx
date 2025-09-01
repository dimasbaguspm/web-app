import { useActiveAppProfile } from '@dimasbaguspm/providers/active-app-profile-provider';
import { useBottomSheetRoute } from '@dimasbaguspm/providers/bottom-sheet-route-provider';
import { useModalRoute } from '@dimasbaguspm/providers/modal-route-provider';
import { BottomSheet, Button, ButtonIcon } from '@dimasbaguspm/versaur';
import { XIcon } from 'lucide-react';
import { FC } from 'react';
import { useNavigate } from 'react-router';

import { MODAL_ROUTES } from '../../constants/modal-routes';
import { DEEP_LINKS } from '../../constants/page-routes';

export const ProfileBottomSheet: FC = () => {
  const { closeBottomSheet } = useBottomSheetRoute();
  const { openModal } = useModalRoute();
  const navigate = useNavigate();

  const { toggleSwitchProfile } = useActiveAppProfile();

  const curriedNavigate = (path: string) => () => navigate(path);

  return (
    <>
      <BottomSheet.Header className="flex flex-row justify-between items-center">
        <BottomSheet.Title>Menu</BottomSheet.Title>
        <ButtonIcon as={XIcon} variant="ghost" size="sm" onClick={closeBottomSheet} aria-label="Close" />
      </BottomSheet.Header>
      <BottomSheet.Body className="mb-4">
        <ul className="divide-y divide-border">
          <li>
            <Button variant="ghost" className="w-full justify-start" onClick={toggleSwitchProfile}>
              Change Profile
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={curriedNavigate(DEEP_LINKS.SETTINGS.path)}
            >
              Settings
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => openModal(MODAL_ROUTES.LOGOUT_CONFIRMATION)}
            >
              Logout
            </Button>
          </li>
        </ul>
      </BottomSheet.Body>
    </>
  );
};
