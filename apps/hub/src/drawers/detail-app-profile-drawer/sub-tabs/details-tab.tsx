import { AppModel, AppProfileModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { useModalRoute } from '@dimasbaguspm/providers/modal-route-provider';
import { formatHiAppData, formatHiAppProfile } from '@dimasbaguspm/utils/data';
import { AttributeList, Button, ButtonGroup, ButtonIcon, Icon } from '@dimasbaguspm/versaur';
import { Edit2Icon, TrashIcon } from 'lucide-react';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../../../constants/drawer-routes';
import { MODAL_ROUTES } from '../../../constants/modal-routes';

interface DetailsTabProps {
  app: AppModel;
  appProfile: AppProfileModel;
}

export const DetailsTab: FC<DetailsTabProps> = ({ app, appProfile }) => {
  const { openModal } = useModalRoute();
  const { openDrawer } = useDrawerRoute();

  const formattedApp = formatHiAppData(app);
  const formattedAppProfile = formatHiAppProfile(appProfile);

  const handleOnEditClick = () => {
    openDrawer(DRAWER_ROUTES.EDIT_APP_PROFILE, { appId: app.id, appProfileId: appProfile.id });
  };

  const handleOnDeleteClick = () => {
    openModal(MODAL_ROUTES.DELETE_APP_PROFILE, { appProfileId: appProfile.id });
  };

  return (
    <>
      <ButtonGroup alignment="between" hasMargin>
        <Button variant="outline" onClick={handleOnEditClick}>
          <Icon as={Edit2Icon} size="sm" color="inherit" />
          Edit
        </Button>
        <ButtonIcon as={TrashIcon} variant="danger-outline" aria-label="Delete Profile" onClick={handleOnDeleteClick} />
      </ButtonGroup>
      <AttributeList columns={2}>
        <AttributeList.Item title="App Related">{formattedApp.name}</AttributeList.Item>
        <AttributeList.Item title="Type">{formattedAppProfile.type}</AttributeList.Item>
        <AttributeList.Item title="Created At">{formattedAppProfile.createdDateTime}</AttributeList.Item>
      </AttributeList>
    </>
  );
};
