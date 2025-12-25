import { AppModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { AdminGuard } from '@dimasbaguspm/utils/admin-guard';
import { formatHiAppData } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import { Anchor, AttributeList, Button, ButtonGroup, Drawer, Heading, Hr, Icon } from '@dimasbaguspm/versaur';
import { Edit2Icon } from 'lucide-react';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../../../constants/drawer-routes';

interface DetailsTabProps {
  app: AppModel;
}

export const DetailsTab: FC<DetailsTabProps> = ({ app }) => {
  const { description, documentationUrl, termsOfServiceUrl, privacyPolicyUrl } = formatHiAppData(app);
  const { openDrawer } = useDrawerRoute();

  const handleOnEditClick = () => {
    openDrawer(DRAWER_ROUTES.EDIT_APP, { appId: app.id });
  };

  return (
    <>
      <Drawer.Body>
        <AdminGuard>
          <ButtonGroup hasMargin>
            <Button variant="outline" onClick={handleOnEditClick}>
              <Icon as={Edit2Icon} size="sm" color="inherit" />
              Edit
            </Button>
          </ButtonGroup>
        </AdminGuard>

        <div className="mb-4">
          {description
            ? description.split('\n').map((line, idx) => (
                <span key={idx}>
                  {line}
                  <br />
                </span>
              ))
            : 'No description available.'}
        </div>
        <Hr hasMargin />

        <div className="mb-4">
          <Heading as="h4" hasMargin>
            Links
          </Heading>
          <AttributeList>
            <If condition={documentationUrl}>
              <AttributeList.Item title="Documentation" span={12}>
                <Anchor href={documentationUrl} target="_blank" rel="noopener noreferrer">
                  {documentationUrl}
                </Anchor>
              </AttributeList.Item>
            </If>
            <If condition={termsOfServiceUrl}>
              <AttributeList.Item title="Terms of Service" span={12}>
                <Anchor href={termsOfServiceUrl} target="_blank" rel="noopener noreferrer">
                  {termsOfServiceUrl}
                </Anchor>
              </AttributeList.Item>
            </If>
            <If condition={privacyPolicyUrl}>
              <AttributeList.Item title="Privacy Policy" span={12}>
                <Anchor href={privacyPolicyUrl} target="_blank" rel="noopener noreferrer">
                  {privacyPolicyUrl}
                </Anchor>
              </AttributeList.Item>
            </If>
          </AttributeList>
        </div>
      </Drawer.Body>
    </>
  );
};
