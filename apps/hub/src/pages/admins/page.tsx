import { AdminGuard } from '@dimasbaguspm/utils/admin-guard';
import { PageContent, PageHeader, PageLayout } from '@dimasbaguspm/versaur';
import { FC } from 'react';

const AdminsPage: FC = () => {
  return (
    <PageLayout>
      <PageLayout.HeaderRegion>
        <PageHeader title="Admins" subtitle="Panel to manage core functions and settings." size="wide" />
      </PageLayout.HeaderRegion>
      <PageLayout.ContentRegion>
        <PageContent size="wide">Admins Page</PageContent>
      </PageLayout.ContentRegion>
    </PageLayout>
  );
};

const AdminsPageWithGuard = () => {
  return (
    <AdminGuard showWarning>
      <AdminsPage />
    </AdminGuard>
  );
};

export default AdminsPageWithGuard;
