import { Button, ButtonGroup, ButtonIcon, Icon, PageContent, PageHeader } from '@dimasbaguspm/versaur';
import { HardDriveDownloadIcon } from 'lucide-react';
import { Outlet } from 'react-router';

import { ActionHeader } from './components/action-header';
import { FilterControl } from './components/filter-control';

const SummaryLayout = () => {
  return (
    <>
      <PageHeader
        title="Summary"
        subtitle="Manage your summary transactions"
        actions={
          <ButtonGroup>
            <Button>
              <Icon as={HardDriveDownloadIcon} color="inherit" />
              Report
            </Button>
          </ButtonGroup>
        }
        mobileActions={
          <ButtonGroup>
            <ButtonIcon as={HardDriveDownloadIcon} aria-label="Export" />
          </ButtonGroup>
        }
      />
      <PageContent>
        <ActionHeader />
        <FilterControl />
        <Outlet />
      </PageContent>
    </>
  );
};

export default SummaryLayout;
