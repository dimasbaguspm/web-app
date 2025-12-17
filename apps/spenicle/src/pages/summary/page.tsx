import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
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
import { FileTextIcon } from 'lucide-react';
import { Outlet } from 'react-router';

import { useSummaryFilter } from '../../hooks/use-summary-filter';

import { ActionHeader } from './components/action-header';

const SummaryLayout = () => {
  const { isMobile } = useWindowResize();
  const { appliedFilters } = useSummaryFilter();

  const subTitleText = `${formatDate(appliedFilters.dateFrom, DateFormat.DAY_MONTH_YEAR)} until ${formatDate(appliedFilters.dateTo, DateFormat.DAY_MONTH_YEAR)}`;

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
                <Text fontSize="sm" color="gray">
                  {subTitleText}
                </Text>
              </Card.ListItem>
            </Card.List>
          }
          size="wide"
          actions={
            <ButtonGroup>
              <Button variant="outline">
                <Icon as={FileTextIcon} color="inherit" size="sm" />
                View All Transactions
              </Button>
            </ButtonGroup>
          }
          mobileActions={
            <ButtonGroup>
              <ButtonIcon as={FileTextIcon} variant="outline" aria-label="View Transactions" />
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
