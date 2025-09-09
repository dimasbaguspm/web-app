import { AppModel, AppProfileModel } from '@dimasbaguspm/interfaces';
import { formatHiAppData, formatHiAppProfile } from '@dimasbaguspm/utils/data';
import { AttributeList, Button, ButtonGroup, ButtonIcon, Icon } from '@dimasbaguspm/versaur';
import { Edit2Icon, TrashIcon } from 'lucide-react';
import { FC } from 'react';

interface DetailsTabProps {
  app: AppModel;
  appProfile: AppProfileModel;
}

export const DetailsTab: FC<DetailsTabProps> = ({ app, appProfile }) => {
  const formattedApp = formatHiAppData(app);
  const formattedAppProfile = formatHiAppProfile(appProfile);

  return (
    <>
      <ButtonGroup alignment="between" hasMargin>
        <Button variant="outline">
          <Icon as={Edit2Icon} size="sm" color="inherit" />
          Edit
        </Button>
        <ButtonIcon as={TrashIcon} variant="danger-outline" aria-label="Delete Profile" />
      </ButtonGroup>
      <AttributeList columns={2}>
        <AttributeList.Item title="App Related">{formattedApp.name}</AttributeList.Item>
        <AttributeList.Item title="Type">{formattedAppProfile.type}</AttributeList.Item>
        <AttributeList.Item title="Created At">{formattedAppProfile.createdDateTime}</AttributeList.Item>
      </AttributeList>
    </>
  );
};
