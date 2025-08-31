import { createContext } from 'react';

import { GlobalProviderModel } from './types';

export const GlobalProviderContext = createContext<GlobalProviderModel | null>(null);
