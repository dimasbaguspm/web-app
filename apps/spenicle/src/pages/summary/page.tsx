import {
  Button,
  ButtonGroup,
  ButtonIcon,
  Icon,
  PageContent,
  PageHeader,
} from '@dimasbaguspm/versaur';
import { DownloadCloudIcon } from 'lucide-react';
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
              <Icon as={DownloadCloudIcon} color="inherit" />
              Report
            </Button>
          </ButtonGroup>
        }
        mobileActions={
          <ButtonGroup>
            <ButtonIcon as={DownloadCloudIcon} aria-label="Export" />
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
