import { useApiHiAuthSetActiveProfile } from '@dimasbaguspm/hooks/use-api';
import { useAuthProvider } from '@dimasbaguspm/providers/auth-provider';
import { useBottomSheetRoute } from '@dimasbaguspm/providers/bottom-sheet-route-provider';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { useModalRoute } from '@dimasbaguspm/providers/modal-route-provider';
import { formatAppProfile } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import {
  Avatar,
  Badge,
  BadgeGroup,
  Modal,
  Button,
  ButtonGroup,
  LoadingIndicator,
  NoResults,
  SelectableSingleInput,
  Text,
} from '@dimasbaguspm/versaur';
import { UserSearchIcon } from 'lucide-react';
import { FC, useState } from 'react';

import { useAppProfileSwitcherData } from './use-app-profile-switcher-data';

interface ProfileSwitcherModalProps {
  isSessionCheck?: boolean;
}

export const ProfileSwitcherModal: FC<ProfileSwitcherModalProps> = ({ isSessionCheck }) => {
  const { activeProfile } = useAuthProvider();

  const { closeModal } = useModalRoute();
  const { isOpen: isBottomSheetOpen, closeBottomSheet } = useBottomSheetRoute();
  const { isOpen: isDrawerOpen, closeDrawer } = useDrawerRoute();

  const [selectedId, setSelectedId] = useState<number | null>(activeProfile ? +activeProfile.id : null);

  const { profiles, isFetching } = useAppProfileSwitcherData();

  const [setActiveProfile, , { isPending: isSettingActiveProfile }] = useApiHiAuthSetActiveProfile();

  const handleOnSubmit = async () => {
    await setActiveProfile({
      profileId: selectedId!,
    });

    // NOTE: if this is a session check, we don't want to close the modal
    if (isSessionCheck) return;

    closeModal();

    if (isBottomSheetOpen) closeBottomSheet();
    if (isDrawerOpen) closeDrawer();
  };

  return (
    <>
      <Modal.Header>Select Profile</Modal.Header>

      <Modal.Body className="max-h-[56dvh] overflow-y-auto">
        <If condition={isFetching}>
          <LoadingIndicator size="sm" type="bar" />
        </If>
        <If condition={[!isFetching, profiles.length]}>
          <ul>
            {profiles.map((profile) => {
              const { name, initial, isGroupRelated } = formatAppProfile(profile);

              const isChecked = profile.id === selectedId;

              const handleOnClick = () => {
                setSelectedId(isChecked ? null : profile.id);
              };

              return (
                <li key={profile.id}>
                  <SelectableSingleInput
                    value={profile.id.toString()}
                    onChange={handleOnClick}
                    checked={isChecked}
                    label={
                      <div className="flex gap-2 items-center">
                        <Avatar>{initial}</Avatar>
                        <Text>{name}</Text>
                        <BadgeGroup>
                          {isGroupRelated ? (
                            <Badge color="secondary">Group</Badge>
                          ) : (
                            <Badge color="tertiary">Personal</Badge>
                          )}
                        </BadgeGroup>
                      </div>
                    }
                  />
                </li>
              );
            })}
          </ul>
        </If>
        <If condition={[!isFetching, !profiles.length]}>
          <NoResults icon={UserSearchIcon} title="No profiles found" subtitle="Register a new profile to get started" />
        </If>
      </Modal.Body>
      <Modal.Footer>
        <ButtonGroup alignment={'end'} fluid>
          <Button onClick={closeModal} variant="ghost">
            Cancel
          </Button>

          <If condition={profiles.length}>
            <Button onClick={handleOnSubmit} disabled={isSettingActiveProfile}>
              Select
            </Button>
          </If>
        </ButtonGroup>
      </Modal.Footer>
    </>
  );
};
