import { createContext } from 'react';

import { ModalRouteModel } from './types';

export const ModalRouteContext = createContext<ModalRouteModel | null>(null);
