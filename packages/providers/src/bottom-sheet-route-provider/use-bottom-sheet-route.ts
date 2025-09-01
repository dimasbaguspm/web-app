import { useContext } from 'react';

import { BottomSheetRouteContext } from './context';
import { BottomSheetRouteModel } from './types';

export const useBottomSheetRoute = <Params, State>() => {
  const context = useContext(BottomSheetRouteContext);
  if (!context) {
    throw new Error('BottomSheet must be used within a BottomSheetProvider');
  }
  return context as BottomSheetRouteModel<Params, State>;
};
