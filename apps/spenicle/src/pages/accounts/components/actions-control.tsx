import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { Button, ButtonGroup, ButtonMenuIcon, Icon } from '@dimasbaguspm/versaur';
import { ArrowDown10Icon, ArrowUp10Icon, ArrowUpAZIcon, FilterIcon, SortDescIcon } from 'lucide-react';

import { DRAWER_ROUTES } from '../../../constants/drawer-routes';
import { useAccountFilter } from '../hooks/use-account-filter';

export const ActionsControl = () => {
  const { openDrawer } = useDrawerRoute();
  const { addFilter, getFilterValue } = useAccountFilter();

  const handleFilterClick = () => {
    openDrawer(DRAWER_ROUTES.FILTER_ACCOUNT);
  };

  return (
    <ButtonGroup className="mb-4">
      <Button variant="outline" onClick={handleFilterClick}>
        <Icon as={FilterIcon} color="inherit" size="sm" />
        Filter
      </Button>
      <ButtonMenuIcon as={SortDescIcon} aria-label="Sort accounts by" variant="outline">
        <ButtonMenuIcon.Item
          onClick={() => addFilter('sortBy', 'name-desc')}
          active={getFilterValue('sortBy') === 'name-desc'}
        >
          <Icon as={ArrowUpAZIcon} color="inherit" size="sm" />
          Name
        </ButtonMenuIcon.Item>
        <ButtonMenuIcon.Item
          onClick={() => addFilter('sortBy', 'amount-asc')}
          active={getFilterValue('sortBy') === 'amount-asc'}
        >
          <Icon as={ArrowUp10Icon} color="inherit" size="sm" /> Amount
        </ButtonMenuIcon.Item>
        <ButtonMenuIcon.Item
          onClick={() => addFilter('sortBy', 'amount-desc')}
          active={getFilterValue('sortBy') === 'amount-desc'}
        >
          <Icon as={ArrowDown10Icon} color="inherit" size="sm" /> Amount
        </ButtonMenuIcon.Item>
      </ButtonMenuIcon>
    </ButtonGroup>
  );
};
