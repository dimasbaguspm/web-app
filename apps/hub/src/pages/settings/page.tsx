import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { ActionCard, Icon, PageContent, PageHeader, PageLayout, Text } from '@dimasbaguspm/versaur';
import { LockKeyholeOpenIcon, UserIcon } from 'lucide-react';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

const SettingPage = () => {
  const { isDesktop } = useWindowResize();
  const { openDrawer } = useDrawerRoute();

  const handleOnProfileClick = () => {
    openDrawer(DRAWER_ROUTES.MANAGE_SETTING_PROFILE);
  };

  const handleOnSecurityClick = () => {
    openDrawer(DRAWER_ROUTES.MANAGE_SETTING_PASSWORD);
  };

  return (
    <PageLayout>
      <PageLayout.HeaderRegion>
        <PageHeader title="Settings" size="wide" />
      </PageLayout.HeaderRegion>
      <PageLayout.ContentRegion>
        <PageContent size="wide">
          <div className="flex flex-row items-center gap-2 mb-4">
            <Text fontSize="lg" fontWeight="semibold">
              General
            </Text>
            {isDesktop && (
              <Text color="gray" fontSize="sm" fontWeight="normal">
                Manage your general account settings and preferences.
              </Text>
            )}
          </div>

          <ActionCard.Group>
            <ActionCard
              icon={<Icon as={UserIcon} size="md" color="inherit" />}
              title="Profile"
              subtitle={isDesktop ? 'Update your personal information and preferences' : undefined}
              onClick={handleOnProfileClick}
            />
            <ActionCard
              icon={<Icon as={LockKeyholeOpenIcon} size="md" color="inherit" />}
              title="Security"
              subtitle={isDesktop ? 'Manage your password and two-factor authentication.' : undefined}
              onClick={handleOnSecurityClick}
            />
          </ActionCard.Group>
        </PageContent>
      </PageLayout.ContentRegion>
    </PageLayout>
  );
};

export default SettingPage;
