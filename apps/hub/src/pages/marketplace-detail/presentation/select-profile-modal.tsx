import { LOGIN_BASE_URL } from '@dimasbaguspm/constants';
import { useApiHiAppProfilesPaginatedQuery } from '@dimasbaguspm/hooks/use-api';
import { AppModel } from '@dimasbaguspm/interfaces';
import { formatAppProfile } from '@dimasbaguspm/utils/data';
import {
  Avatar,
  Badge,
  Button,
  ButtonGroup,
  Icon,
  LoadingIndicator,
  Modal,
  NoResults,
  SelectableSingleInput,
  Text,
} from '@dimasbaguspm/versaur';
import { RocketIcon, SearchXIcon } from 'lucide-react';
import { FC, useState } from 'react';

import { useAuthProvider } from '../../../providers/auth-provider';

interface Props {
  app: AppModel;
  isOpen: boolean;
  onClose: () => void;
}

export const SelectProfileModal: FC<Props> = ({ app, isOpen, onClose }) => {
  const { appProfiles } = useAuthProvider();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [profiles, , { isFetching }] = useApiHiAppProfilesPaginatedQuery(
    {
      id: appProfiles.map((profile) => profile.id),
      appId: [app.id],
      pageSize: 5,
    },
    {
      enabled: Boolean(app) && Boolean(appProfiles.length),
    },
  );

  const hasProfiles = Boolean(profiles?.items?.length);

  const handleOnLaunchClick = (profileId: number | null) => {
    if (!profileId) return;

    const url = new URL(`${LOGIN_BASE_URL}/verify-app-access`);
    url.searchParams.set('profileId', profileId.toString());

    window.open(url.toString(), '_blank');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="top" size="lg">
      <Modal.Header>Select Profile</Modal.Header>

      <Modal.Body>
        {isFetching ? (
          <LoadingIndicator type="bar" size="sm" />
        ) : (
          <>
            {hasProfiles && profiles ? (
              <ul>
                {profiles.items.map((profile) => {
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
                        onClick={handleOnClick}
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
            ) : (
              <NoResults
                icon={SearchXIcon}
                title="No profiles found"
                subtitle="Create a profile to use this app"
              />
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <ButtonGroup>
          <Button
            disabled={!hasProfiles || !selectedId}
            onClick={() => handleOnLaunchClick(selectedId)}
          >
            <Icon as={RocketIcon} color="inherit" /> Launch
          </Button>
        </ButtonGroup>
      </Modal.Footer>
    </Modal>
  );
};
