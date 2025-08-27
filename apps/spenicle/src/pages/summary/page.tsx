import { PageHeader } from '@dimasbaguspm/versaur';
import { Outlet } from 'react-router';

import { ActionHeader } from './components/action-header';

const SummaryLayout = () => {
  return (
    <>
      <PageHeader
        title="Summary"
        subtitle="Manage your summary transactions"
        actions={<ActionHeader />}
        mobileActions={<ActionHeader />}
      />
      <Outlet />
    </>
  );
};

export default SummaryLayout;
