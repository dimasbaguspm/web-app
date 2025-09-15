import { useApiHiAppProfilesInfiniteQuery, useApiHiAuthSetActiveProfile } from '@dimasbaguspm/hooks/use-api';
import { formatHiAppProfile } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import {
  Avatar,
  Badge,
  BadgeGroup,
  Button,
  ButtonGroup,
  Card,
  Modal,
  NoResults,
  PageLoader,
  SelectableSingleInput,
} from '@dimasbaguspm/versaur';
import { noop } from 'lodash';
import { UserXIcon } from 'lucide-react';
import { FC, useState } from 'react';

import { useAuthProvider } from '../../auth-provider';
import { useGlobalProvider } from '../../global-provider';

interface ProfileSwitcherModalProps {
  onSubmit?: () => Promise<void>;
}

export const ProfileSwitcherModal: FC<ProfileSwitcherModalProps> = ({ onSubmit }) => {
  const { activeProfile } = useAuthProvider();
  const { appId } = useGlobalProvider();

  const [selectedId, setSelectedId] = useState<number | null>(activeProfile ? +activeProfile.id : null);

  const [appProfiles, , { isInitialFetching, isFetchingNextPage, hasNextPage }, { fetchNextPage }] =
    useApiHiAppProfilesInfiniteQuery({
      appId: [appId],
    });

  const [setActiveProfile, , { isPending: isSettingActiveProfile }] = useApiHiAuthSetActiveProfile();

  const handleOnSubmit = async () => {
    await setActiveProfile({
      profileId: selectedId!,
    });
    await onSubmit?.();
  };

  return (
    <Modal isOpen onClose={noop} disableEscapeKeyDown disableOverlayClickToClose>
      <Modal.Header>Select Profile</Modal.Header>

      <Modal.Body className="max-h-[56dvh] overflow-y-auto">
        <If condition={isInitialFetching}>
          <PageLoader minimal />
        </If>
        <If condition={[!isInitialFetching, appProfiles.length]}>
          <ul className="mb-4">
            {appProfiles.map((appProfile) => {
              const { name, initial, groupRelatedVariant, type } = formatHiAppProfile(appProfile);

              const isChecked = appProfile.id === selectedId;

              const handleOnClick = () => {
                setSelectedId(isChecked ? null : appProfile.id);
              };

              return (
                <li key={appProfile.id}>
                  <SelectableSingleInput
                    value={appProfile.id.toString()}
                    onChange={handleOnClick}
                    checked={isChecked}
                    label={
                      <Card
                        as="div"
                        size="none"
                        title={name}
                        avatar={<Avatar>{initial}</Avatar>}
                        badge={
                          <BadgeGroup>
                            <Badge color={groupRelatedVariant}>{type}</Badge>
                          </BadgeGroup>
                        }
                      />
                    }
                  />
                </li>
              );
            })}
          </ul>
          <If condition={hasNextPage}>
            <ButtonGroup alignment="center">
              <Button onClick={() => fetchNextPage()} variant="outline" disabled={isFetchingNextPage}>
                Load More
              </Button>
            </ButtonGroup>
          </If>
        </If>
        <If condition={[!isInitialFetching, !appProfiles.length]}>
          <NoResults icon={UserXIcon} title="No profiles found" subtitle="Register a new profile to get started" />
        </If>
      </Modal.Body>
      <Modal.Footer>
        <ButtonGroup alignment="end" fluid>
          <If condition={appProfiles.length}>
            <Button onClick={handleOnSubmit} disabled={isSettingActiveProfile}>
              Select
            </Button>
          </If>
        </ButtonGroup>
      </Modal.Footer>
    </Modal>
  );
};
