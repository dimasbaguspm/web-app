import { useContext } from 'react';

import { DrawerRouteContext } from './context';
import { DrawerRouteModel } from './types';

export const useDrawerRoute = <Params, State>() => {
  const context = useContext(DrawerRouteContext);
  if (!context) {
    throw new Error('useDrawerRoute must be used within a DrawerRouteProvider');
  }
  return context as DrawerRouteModel<Params, State>;
};
