import { useContext } from 'react';

import { ModalRouteContext } from './context';
import { ModalRouteModel } from './types';

export const useModalRoute = <Params, State>() => {
  const context = useContext(ModalRouteContext);
  if (!context) {
    throw new Error('useModalRoute must be used within a ModalRouteProvider');
  }
  return context as ModalRouteModel<Params, State>;
};
