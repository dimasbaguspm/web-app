import { createContext } from 'react';

import { BottomSheetRouteModel } from './types';

export const BottomSheetRouteContext = createContext<BottomSheetRouteModel | null>(null);
