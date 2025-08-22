import { createContext } from 'react';

import { DrawerRouteModel } from './types';

export const DrawerRouteContext = createContext<DrawerRouteModel | null>(null);
