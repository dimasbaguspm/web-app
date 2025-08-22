import { useContext } from 'react';

import { DrawerRouteContext } from './context';
import { DrawerParams, DrawerRouteModel } from './types';

export const useDrawerRoute = <Params extends DrawerParams>() => {
  const context = useContext(DrawerRouteContext);
  if (!context) {
    throw new Error('useDrawerRoute must be used within a DrawerRouteProvider');
  }
  return context as DrawerRouteModel<Params>;
};
