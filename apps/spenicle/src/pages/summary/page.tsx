import { Button, ButtonGroup, ButtonIcon, Icon, PageContent, PageHeader } from '@dimasbaguspm/versaur';
import { HardDriveDownloadIcon } from 'lucide-react';
import { Outlet } from 'react-router';

import { ActionHeader } from './components/action-header';

const SummaryLayout = () => {
  return (
    <>
      <PageHeader
        title="Summary"
        subtitle="Manage your summary transactions"
        actions={
          <ButtonGroup>
            <Button>
              <Icon as={HardDriveDownloadIcon} color="inherit" size="sm" />
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
        <Outlet />
      </PageContent>
    </>
  );
};

export default SummaryLayout;
