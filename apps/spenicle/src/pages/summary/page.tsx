import { PageContent, PageHeader } from '@dimasbaguspm/versaur';
import { Outlet } from 'react-router';

import { ActionHeader } from './components/action-header';
import { FilterControl } from './components/filter-control';

const SummaryLayout = () => {
  return (
    <>
      <PageHeader title="Summary" subtitle="Manage your summary transactions" />
      <PageContent>
        <ActionHeader />
        <FilterControl />
        <Outlet />
      </PageContent>
    </>
  );
};

export default SummaryLayout;
