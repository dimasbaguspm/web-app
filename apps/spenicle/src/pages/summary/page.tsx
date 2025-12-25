import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';
import {
  Badge,
  Button,
  ButtonGroup,
  ButtonIcon,
  Card,
  Icon,
  PageContent,
  PageHeader,
  PageLayout,
  Text,
} from '@dimasbaguspm/versaur';
import { cx } from 'class-variance-authority';
import { startCase } from 'lodash';
import { ListCollapseIcon } from 'lucide-react';
import { Outlet } from 'react-router';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';
import { useSummaryFilter } from '../../hooks/use-summary-filter';

import { ActionHeader } from './components/action-header';

const SummaryLayout = () => {
  const { isMobile } = useWindowResize();
  const { appliedFilters } = useSummaryFilter();
  const { openDrawer } = useDrawerRoute();

  const subTitleText = `${formatDate(appliedFilters.dateFrom, DateFormat.DAY_MONTH_YEAR)} until ${formatDate(appliedFilters.dateTo, DateFormat.DAY_MONTH_YEAR)}`;

  const handleOnViewPeriodClick = () => {
    openDrawer(DRAWER_ROUTES.TIMELINE_TRANSACTIONS, {
      startDate: appliedFilters.dateFrom,
      endDate: appliedFilters.dateTo,
    });
  };

  return (
    <PageLayout>
      <PageLayout.HeaderRegion>
        <PageHeader
          title="Summary"
          subtitle={
            <Card.List>
              <Card.ListItem>
                <Badge shape="rounded">{startCase(appliedFilters.frequency)}</Badge>
              </Card.ListItem>
              <Card.ListItem>
                <Text as="small" color="gray">
                  {subTitleText}
                </Text>
              </Card.ListItem>
            </Card.List>
          }
          size="wide"
          actions={
            <ButtonGroup>
              <Button variant="outline" onClick={handleOnViewPeriodClick}>
                <Icon as={ListCollapseIcon} color="inherit" size="sm" />
                View Period Transactions
              </Button>
            </ButtonGroup>
          }
          mobileActions={
            <ButtonGroup>
              <ButtonIcon
                as={ListCollapseIcon}
                variant="outline"
                aria-label="View Transactions"
                onClick={handleOnViewPeriodClick}
              />
            </ButtonGroup>
          }
        />
      </PageLayout.HeaderRegion>
      <PageLayout.ContentRegion>
        <PageContent size={isMobile ? 'narrow' : 'wide'} className={cx(isMobile && 'pb-20')}>
          <ActionHeader />
          <Outlet />
        </PageContent>
      </PageLayout.ContentRegion>
    </PageLayout>
  );
};

export default SummaryLayout;
