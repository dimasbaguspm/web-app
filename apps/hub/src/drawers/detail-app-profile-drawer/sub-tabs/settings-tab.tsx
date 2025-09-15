import { AppProfileModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { ActionCard } from '@dimasbaguspm/versaur';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../../../constants/drawer-routes';

interface SettingsTabProps {
  appProfile: AppProfileModel;
}

export const SettingsTab: FC<SettingsTabProps> = ({ appProfile }) => {
  const { openDrawer } = useDrawerRoute();

  const handleOnManagePin = () => {
    openDrawer(DRAWER_ROUTES.MANAGE_APP_PROFILE_PIN, {
      appProfileId: appProfile.id,
    });
  };
  return (
    <>
      <ActionCard.Group>
        <ActionCard
          title={appProfile.hasAuth ? 'Change PIN' : 'Set PIN'}
          subtitle="Manage your authentication PIN"
          onClick={handleOnManagePin}
        />
      </ActionCard.Group>
    </>
  );
};
