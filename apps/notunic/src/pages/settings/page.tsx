import { ActionCard, Icon, PageContent, PageHeader, PageLayout } from '@dimasbaguspm/versaur';
import { FoldersIcon } from 'lucide-react';
import { useNavigate } from 'react-router';

import { DEEP_LINKS } from '../../constants/page-routes';

const SettingsPage = () => {
  const navigate = useNavigate();

  const handleOnThreadCategoriesClick = () => {
    navigate(DEEP_LINKS.SETTINGS_THREAD_CATEGORIES.path);
  };

  const handleOnCommentCategoriesClick = () => {
    navigate(DEEP_LINKS.SETTINGS_COMMENT_CATEGORIES.path);
  };

  return (
    <PageLayout>
      <PageLayout.HeaderRegion>
        <PageHeader title="Settings" subtitle="Manage profile preferences and application settings" size="wide" />
      </PageLayout.HeaderRegion>
      <PageLayout.ContentRegion>
        <PageContent size="wide">
          <ActionCard.Group>
            <ActionCard
              icon={<Icon as={FoldersIcon} size="md" color="inherit" />}
              title="Thread Categories"
              subtitle="Manage categories for organizing threads"
              onClick={handleOnThreadCategoriesClick}
            />
            <ActionCard
              icon={<Icon as={FoldersIcon} size="md" color="inherit" />}
              title="Comment Categories"
              subtitle="Manage categories for organizing comments"
              onClick={handleOnCommentCategoriesClick}
            />
          </ActionCard.Group>
        </PageContent>
      </PageLayout.ContentRegion>
    </PageLayout>
  );
};

export default SettingsPage;
