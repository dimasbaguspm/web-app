import { AppProfileModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { useModalRoute } from '@dimasbaguspm/providers/modal-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import { ActionCard, Icon } from '@dimasbaguspm/versaur';
import { LockKeyholeIcon, LockKeyholeOpenIcon } from 'lucide-react';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../../../constants/drawer-routes';
import { MODAL_ROUTES } from '../../../constants/modal-routes';

interface SettingsTabProps {
  appProfile: AppProfileModel;
}

export const SettingsTab: FC<SettingsTabProps> = ({ appProfile }) => {
  const { openDrawer } = useDrawerRoute();
  const { openModal } = useModalRoute();

  const handleOnManagePin = () => {
    openDrawer(DRAWER_ROUTES.MANAGE_APP_PROFILE_PIN, {
      appProfileId: appProfile.id,
    });
  };

  const handleOnRemovePin = () => {
    openModal(MODAL_ROUTES.DELETE_APP_PROFILE_AUTH, {
      appProfileId: appProfile.id,
    });
  };

  return (
    <>
      <ActionCard.Group>
        <ActionCard
          icon={<Icon as={LockKeyholeIcon} size="sm" color="inherit" />}
          title={appProfile.hasAuth ? 'Change PIN' : 'Set PIN'}
          subtitle="Manage your authentication PIN"
          onClick={handleOnManagePin}
        />
        <If condition={appProfile.hasAuth}>
          <ActionCard
            icon={<Icon as={LockKeyholeOpenIcon} size="sm" color="inherit" />}
            title="Remove PIN"
            subtitle="Revoke your authentication PIN"
            onClick={handleOnRemovePin}
          />
        </If>
      </ActionCard.Group>
    </>
  );
};
