import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { Button, ButtonGroup, Icon } from '@dimasbaguspm/versaur';
import { FilterIcon } from 'lucide-react';

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
    </ButtonGroup>
  );
};
