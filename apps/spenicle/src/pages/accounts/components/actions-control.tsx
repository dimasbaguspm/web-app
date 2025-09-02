import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { Button, ButtonGroup, ButtonMenuIcon, Icon } from '@dimasbaguspm/versaur';
import { FilterIcon, SortDescIcon } from 'lucide-react';

import { DRAWER_ROUTES } from '../../../constants/drawer-routes';

export const ActionsControl = () => {
  const { openDrawer } = useDrawerRoute();

  const handleFilterClick = () => {
    openDrawer(DRAWER_ROUTES.FILTER_ACCOUNT);
  };

  return (
    <ButtonGroup className="mb-4">
      <Button variant="outline" onClick={handleFilterClick}>
        <Icon as={FilterIcon} color="inherit" size="sm" />
        Filter
      </Button>
      <ButtonMenuIcon as={SortDescIcon} aria-label="Sort Accounts" variant="outline">
        <ButtonMenuIcon.Item>Sort by Name</ButtonMenuIcon.Item>
        <ButtonMenuIcon.Item>Sort by Amount</ButtonMenuIcon.Item>
        <ButtonMenuIcon.Item>Sort by Type</ButtonMenuIcon.Item>
      </ButtonMenuIcon>
    </ButtonGroup>
  );
};
