import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { ActionCard, Icon, PageContent, PageHeader } from '@dimasbaguspm/versaur';
import { FoldersIcon, LayoutListIcon, MessageCircleIcon } from 'lucide-react';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

const PreferencesPage = () => {
  const { openDrawer } = useDrawerRoute();

  const handleOpenThreadDisplay = () => {
    //
  };

  const handleOpenThreadGroup = () => {
    openDrawer(DRAWER_ROUTES.MANAGE_THREAD_GROUPS);
  };

  const handleOpenComment = () => {
    //
  };
  return (
    <>
      <PageHeader title="Preferences Page" />
      <PageContent>
        <ActionCard.Group>
          <ActionCard
            icon={<Icon as={LayoutListIcon} color="inherit" size="md" />}
            title="Thread Display"
            subtitle="Set your preferences for how threads are displayed and organized"
            onClick={handleOpenThreadDisplay}
          />
          <ActionCard
            icon={<Icon as={FoldersIcon} color="inherit" size="md" />}
            title="Thread Group"
            subtitle="Manage your thread groups and organize your threads effectively"
            onClick={handleOpenThreadGroup}
          />
          <ActionCard
            icon={<Icon as={MessageCircleIcon} color="inherit" size="md" />}
            title="Comment"
            subtitle="Configure how comments are handled and displayed in your threads"
            onClick={handleOpenComment}
          />
        </ActionCard.Group>
      </PageContent>
    </>
  );
};

export default PreferencesPage;
