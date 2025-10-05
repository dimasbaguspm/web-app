import { ActionCard, Icon, PageContent, PageHeader } from '@dimasbaguspm/versaur';
import { FoldersIcon } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router';

import { DEEP_LINKS } from '../../constants/page-routes';

const SettingsPage = () => {
  const navigate = useNavigate();

  const handleOnThreadCategoriesClick = () => {
    navigate(DEEP_LINKS.SETTINGS_THREAD_CATEGORIES.path);
  };

  return (
    <>
      <PageHeader title="Settings" subtitle="Manage profile preferences and application settings" />
      <PageContent>
        <ActionCard.Group>
          <ActionCard
            icon={<Icon as={FoldersIcon} size="md" color="inherit" />}
            title="Thread Categories"
            subtitle="Manage categories for organizing threads"
            onClick={handleOnThreadCategoriesClick}
          />
          <Outlet />
        </ActionCard.Group>
      </PageContent>
    </>
  );
};

export default SettingsPage;
