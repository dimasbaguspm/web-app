import { HUB_BASE_URL } from '@dimasbaguspm/constants';
import {
  useApiHiAppProfilesPaginatedQuery,
  useApiHiAuthSetActiveProfile,
} from '@dimasbaguspm/hooks/use-api';
import { AppProfileModel } from '@dimasbaguspm/interfaces';
import { If } from '@dimasbaguspm/utils/if';
import {
  Avatar,
  BottomSheet,
  Button,
  ButtonGroup,
  Icon,
  LoadingIndicator,
  Modal,
  NoResults,
  SelectableSingleInput,
  Text,
  Badge,
} from '@dimasbaguspm/versaur';
import { RocketIcon, UserSearchIcon } from 'lucide-react';
import { FC, useState } from 'react';

import { formatAppProfile } from '../../../utils/src/data/app-profile';
import { useAuthProvider } from '../auth-provider';

type Variant = 'modal' | 'sheet';

interface Props {
  appId: number;
  variant?: Variant;
  isSwitchingProfile: boolean;
  onSuccess: () => void;
}

export const ProfileSelector: FC<Props> = ({
  appId,
  variant = 'modal',
  isSwitchingProfile,
  onSuccess,
}) => {
  const { user, groupMembers, activeProfile } = useAuthProvider();

  const [selectedId, setSelectedId] = useState<number | null>(
    activeProfile ? +activeProfile.id : null,
  );

  const [userAppProfiles, , { isFetching: isUserFetching }] =
    useApiHiAppProfilesPaginatedQuery(
      {
        appId: [appId],
        userId: [user.id],
        pageSize: 100,
      },
      {
        enabled: !!user.id,
      },
    );

  type GroupMember = { groupId: number };

  const [groupAppProfiles, , { isFetching: isGroupFetching }] =
    useApiHiAppProfilesPaginatedQuery(
      {
        appId: [appId],
        groupId: groupMembers.map((member: GroupMember) => member.groupId),
        pageSize: 100,
      },
      {
        enabled: groupMembers.length > 0,
      },
    );

  const [setActiveProfile, , { isPending: isSettingActiveProfile }] =
    useApiHiAuthSetActiveProfile();

  const profiles: AppProfileModel[] = [
    ...(userAppProfiles?.items ?? []),
    ...(groupAppProfiles?.items ?? []),
  ];

  const handleOnSubmit = async () => {
    await setActiveProfile({
      profileId: selectedId!,
    });
    onSuccess();
  };

  const handleNavigateToHub = () => {
    window.location.href = HUB_BASE_URL;
  };

  const isFetching = isUserFetching || isGroupFetching;

  const listContent = (
    <>
      <If condition={[profiles.length]}>
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
                      {isGroupRelated ? (
                        <Badge color="secondary">Group</Badge>
                      ) : (
                        <Badge color="tertiary">Personal</Badge>
                      )}
                    </div>
                  }
                />
              </li>
            );
          })}
        </ul>
      </If>
      <If condition={[!profiles.length]}>
        <NoResults
          icon={UserSearchIcon}
          title="No profiles found"
          subtitle="Register a new profile to get started"
        />
      </If>
    </>
  );

  const footerContent = (
    <ButtonGroup alignment="end">
      <If condition={[profiles.length]}>
        <If condition={[isSwitchingProfile]}>
          <Button onClick={onSuccess} variant="ghost">
            Cancel
          </Button>
        </If>
        <Button onClick={handleOnSubmit} disabled={isSettingActiveProfile}>
          Select
        </Button>
      </If>
      <If condition={[!profiles.length]}>
        <Button onClick={handleNavigateToHub}>
          Go to Hub
          <Icon as={RocketIcon} color="inherit" size="sm" />
        </Button>
      </If>
    </ButtonGroup>
  );

  if (variant === 'sheet') {
    return (
      <BottomSheet disableOverlayClickToClose isOpen onClose={() => {}}>
        <BottomSheet.Header>
          <BottomSheet.Title>Select Profile</BottomSheet.Title>
        </BottomSheet.Header>

        <If condition={isFetching}>
          <LoadingIndicator size="sm" type="bar" />
        </If>

        <If condition={[!isFetching]}>
          <BottomSheet.Body className="max-h-[56dvh] overflow-y-auto">
            {listContent}
          </BottomSheet.Body>
          <BottomSheet.Footer>{footerContent}</BottomSheet.Footer>
        </If>
      </BottomSheet>
    );
  }

  return (
    <Modal
      disableOverlayClickToClose
      disableEscapeKeyDown
      isOpen
      onClose={() => {}}
    >
      <Modal.Header>Select Profile</Modal.Header>

      <If condition={isFetching}>
        <LoadingIndicator size="sm" type="bar" />
      </If>

      <If condition={[!isFetching]}>
        <Modal.Body className="max-h-[56dvh] overflow-y-auto">
          {listContent}
        </Modal.Body>
        <Modal.Footer>{footerContent}</Modal.Footer>
      </If>
    </Modal>
  );
};
