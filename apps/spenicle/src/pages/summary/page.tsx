import { Button, ButtonGroup, ButtonIcon, Icon, PageContent, PageHeader } from '@dimasbaguspm/versaur';
import { PrinterIcon } from 'lucide-react';
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
              <Icon as={PrinterIcon} color="inherit" size="sm" />
              Report
            </Button>
          </ButtonGroup>
        }
        mobileActions={
          <ButtonGroup>
            <ButtonIcon as={PrinterIcon} aria-label="Export" />
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
