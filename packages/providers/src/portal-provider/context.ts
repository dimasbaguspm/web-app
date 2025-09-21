import { createContext } from 'react';

import { PortalProviderModel } from './types';

export const PortalProviderContext = createContext<PortalProviderModel | null>(null);
