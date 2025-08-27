import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { Button, ButtonGroup, Icon } from '@dimasbaguspm/versaur';
import { FilterIcon } from 'lucide-react';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../../../constants/drawer-routes';

export const ActionControl: FC = () => {
  const { openDrawer } = useDrawerRoute();

  const handleOnFilterClick = () => {
    openDrawer(DRAWER_ROUTES.FILTER_SUMMARY);
  };

  return (
    <ButtonGroup className="mb-4" alignment="between">
      <Button variant="outline" onClick={handleOnFilterClick}>
        <Icon as={FilterIcon} color="inherit" size="sm" />
        Filter
      </Button>
    </ButtonGroup>
  );
};
