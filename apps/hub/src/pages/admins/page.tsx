import { AdminGuard } from '@dimasbaguspm/utils/admin-guard';
import { PageContent, PageHeader } from '@dimasbaguspm/versaur';
import { FC } from 'react';

const AdminsPage: FC = () => {
  return (
    <>
      <PageHeader title="Admins" subtitle="Panel to manage core functions and settings." />
      <PageContent>Admins Page</PageContent>
    </>
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
