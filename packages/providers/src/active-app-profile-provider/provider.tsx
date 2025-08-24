import { AppId } from '@dimasbaguspm/constants';
import {
  useApiHiAppProfilesPaginatedQuery,
  useApiHiAuthSetActiveProfile,
} from '@dimasbaguspm/hooks/use-api';
import { AppProfileModel } from '@dimasbaguspm/interfaces';
import { formatAppProfile } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import {
  Avatar,
  Badge,
  BottomSheet,
  Button,
  ButtonGroup,
  Icon,
  LoadingIndicator,
  SelectableSingleInput,
  Text,
} from '@dimasbaguspm/versaur';
import { RocketIcon } from 'lucide-react';
import { FC, ReactNode, useState } from 'react';

import { useAuthProvider } from '../auth-provider';

import { ActiveAppProfileContext } from './context';

interface Props {
  appId: AppId;
  children: ReactNode;
}

export const ActiveAppProfileProvider: FC<Props> = (props) => {
  const { appId, children } = props;

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

  const [groupAppProfiles, , { isFetching: isGroupFetching }] =
    useApiHiAppProfilesPaginatedQuery(
      {
        appId: [appId],
        groupId: groupMembers.map((member) => member.groupId),
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
  };

  const isFetching = isUserFetching || isGroupFetching;

  if (!activeProfile) {
    return (
      <BottomSheet
        disableOverlayClickToClose
        isOpen={!activeProfile}
        onClose={() => {}}
      >
        <BottomSheet.Header>
          <BottomSheet.Title>Select Profile</BottomSheet.Title>
        </BottomSheet.Header>

        <If condition={isFetching}>
          <LoadingIndicator size="sm" type="bar" />
        </If>

        <If condition={[!isFetching, profiles.length]}>
          <BottomSheet.Body>
            <ul>
              {profiles.map((profile) => {
                const { name, initial, isGroupRelated } =
                  formatAppProfile(profile);

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
          </BottomSheet.Body>
          <BottomSheet.Footer>
            <ButtonGroup alignment="end">
              <Button
                onClick={handleOnSubmit}
                disabled={isSettingActiveProfile}
              >
                Select
                <Icon as={RocketIcon} color="inherit" size="sm" />
              </Button>
            </ButtonGroup>
          </BottomSheet.Footer>
        </If>
      </BottomSheet>
    );
  }

  return (
    <ActiveAppProfileContext.Provider value={activeProfile}>
      {children}
    </ActiveAppProfileContext.Provider>
  );
};
